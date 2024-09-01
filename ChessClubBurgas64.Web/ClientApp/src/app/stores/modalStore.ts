import { makeAutoObservable } from "mobx"

interface Modal {
    open: boolean;
    body: JSX.Element | null;
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        body: null
    }

    constructor() {
        makeAutoObservable(this);
    }

    openModal = (content: JSX.Element) => {
        console.log("Otworih formata")
        this.modal.open = true;
        this.modal.body = content;
        console.log(this.modal.open)
        console.log(content)
    }

    closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}