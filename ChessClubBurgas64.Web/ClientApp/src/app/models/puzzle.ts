import {Image} from "./image"

export interface Puzzle {
    id: number;
    title: string;
    description: string;
    solution: string;
    points: number;
    difficulty: string;
    imageUrl: string;
    image: Image
}

export class PuzzleFormValues
{
  id?: number = undefined;
  title: string = '';
  description: string = '';
  solution: string = '';
  points: number = 1;
  difficulty: string = '';
  imageUrl: string = '';
  
  constructor(puzzle?: PuzzleFormValues) {
    if (puzzle) {
      this.id = puzzle.id;
      this.title = puzzle.title;
      this.description = puzzle.description;
      this.solution = puzzle.solution;
      this.points = puzzle.points;
      this.difficulty = puzzle.difficulty;
      this.imageUrl = puzzle.imageUrl;
    }
  }
}

export class Puzzle implements Puzzle {
  constructor(init?: PuzzleFormValues) {
    Object.assign(this, init);
  }
}
