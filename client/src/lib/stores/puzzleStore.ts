import { makeAutoObservable } from "mobx";

export default class PuzzleStore {
    difficulty: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    setDifficulty = (difficulty: string) => {
        this.difficulty = difficulty;
    }
}