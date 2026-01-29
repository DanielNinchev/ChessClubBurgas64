import { createContext } from "react";
import CounterStore from "./counterStore";
import { UiStore } from "./uiStore";
import { AnnouncementStore } from "./announcementStore";

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