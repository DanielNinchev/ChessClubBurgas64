import { Chess } from "chess.js";
import { Puzzle } from "../types";

// The position the solver faces: Lichess puzzles store the FEN one move early, before the opponent's setup move
export function puzzleStartFen(puzzle: Pick<Puzzle, 'fen' | 'previousMove'>) {
    if (!puzzle.previousMove) return puzzle.fen;
    try {
        const game = new Chess(puzzle.fen);
        game.move({
            from: puzzle.previousMove.substring(0, 2),
            to: puzzle.previousMove.substring(2, 4),
            promotion: puzzle.previousMove[4],
        });
        return game.fen();
    } catch {
        return puzzle.fen;
    }
}
