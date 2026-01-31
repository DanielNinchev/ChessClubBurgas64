import { createContext } from "react";
import { AnnouncementStore } from "./announcementStore";
import CounterStore from "./counterStore";
import { UiStore } from "./uiStore";

interface Store {
    counterStore: CounterStore
    uiStore: UiStore
    announcementStore: AnnouncementStore
}

export const store: Store = {
    counterStore: new CounterStore(),
    uiStore: new UiStore(),
    announcementStore: new AnnouncementStore()
}

export const StoreContext = createContext(store);