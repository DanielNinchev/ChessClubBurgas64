import { createContext } from "react";
import AnnouncementStore from './announcementStore';
import CounterStore from "./counterStore";
import PuzzleStore from "./puzzleStore";
import { UiStore } from "./uiStore";

export interface Store {
    counterStore: CounterStore
    uiStore: UiStore
    announcementStore: AnnouncementStore;
    puzzleStore: PuzzleStore;
}

export const store: Store = {
    counterStore: new CounterStore(),
    uiStore: new UiStore(),
    announcementStore: new AnnouncementStore(),
    puzzleStore: new PuzzleStore(),
};

export const StoreContext = createContext(store);