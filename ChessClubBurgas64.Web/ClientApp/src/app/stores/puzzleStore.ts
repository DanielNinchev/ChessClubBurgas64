import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Puzzle, PuzzleFormValues } from "../models/puzzle";
import {Image} from "../models/image"

export default class PuzzleStore {
    puzzleRegistry = new Map<number, Puzzle>();
    selectedPuzzle?: Puzzle = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);
    uploading = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.puzzleRegistry.clear();
                this.loadPuzzles();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString())
        this.predicate.forEach((value, key) => {
            console.log('Key is appended:', key)
            console.log('Value is appended:', value)
            params.append(key, value);
        })
        return params;
    }

    get puzzles() {
        return Array.from(this.puzzleRegistry.values());
    }

    get groupedPuzzles() {
        return Object.entries(
            this.puzzles.reduce((puzzles, puzzle) => {
                const difficulty = puzzle.difficulty;
                puzzles[difficulty] = puzzles[difficulty] ? [...puzzles[difficulty], puzzle] : [puzzle];
                return puzzles;
            }, {} as { [key: string]: Puzzle[] })
        )
    }

    loadPuzzles = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Puzzles.list(this.axiosParams);
            if(result.data && result.pagination){
                result.data.forEach(puzzle => {
                    this.setPuzzle(puzzle);
                })
                this.setPagination(result.pagination);
                this.setLoadingInitial(false);
            }
            else{
                console.log('No data or pagination found in result!')
            }
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadPuzzle = async (id: number) => {
        let puzzle = this.getPuzzle(id);
        if (puzzle) {
            this.selectedPuzzle = puzzle;
            return puzzle;
        }
        else {
            this.setLoadingInitial(true);
            try {
                puzzle = await agent.Puzzles.details(id);
                this.setPuzzle(puzzle);
                runInAction(() => this.selectedPuzzle = puzzle);
                this.setLoadingInitial(false);
                return puzzle;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setPuzzle = (puzzle: Puzzle) => {
        console.log('Puzzle is:', puzzle)
        this.puzzleRegistry.set(puzzle.id, puzzle);
    }

    private getPuzzle = (id: number) => {
        return this.puzzleRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createPuzzle = async (puzzle: PuzzleFormValues, file: Blob) => {
        try {
            const newPuzzle = await agent.Puzzles.create(puzzle, file);
            this.setPuzzle(newPuzzle);
            runInAction(() => this.selectedPuzzle = newPuzzle);
            return newPuzzle
        } catch (error) {
            console.log(error);
        }
    }

    updatePuzzle = async (puzzle: PuzzleFormValues, file: Blob) => {
        try {
            await agent.Puzzles.update(puzzle, file);
            runInAction(() => {
                if (puzzle.id) {
                    this.puzzleRegistry.set(puzzle.id, puzzle as Puzzle);
                    this.selectedPuzzle = puzzle as Puzzle;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deletePuzzle = async (id: number) => {
        this.loading = true;
        try {
            await agent.Puzzles.delete(id);
            runInAction(() => {
                this.puzzleRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    setImage = (image: Image) => {
        if (this.selectedPuzzle)
        {
            this.selectedPuzzle.imageUrl = image.url;
        } 
    }

    clearSelectedPuzzle = () => {
        this.selectedPuzzle = undefined;
    }
}