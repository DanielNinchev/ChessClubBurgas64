import {createContext, useContext} from "react";
import ModalStore from "./modalStore";
import CommonStore from "./commonStore";
import AnnouncementStore from "./announcementStore";
import UserStore from "./userStore";
import ProfileStore from "./profileStore";
import PuzzleStore from "./puzzleStore";

interface Store {
    announcementStore: AnnouncementStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    userStore: UserStore;
    profileStore: ProfileStore;
    puzzleStore: PuzzleStore;
}

export const store: Store = {
    announcementStore: new AnnouncementStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    userStore: new UserStore(),
    profileStore: new ProfileStore(),
    puzzleStore: new PuzzleStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}