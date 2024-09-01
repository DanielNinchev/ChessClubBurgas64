import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";
import { log } from "console";

export default class CommonStore {
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;
    
    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem('jwt', token)
                } else {
                    localStorage.removeItem('jwt')
                }
            }
        )
    }

    setServerError(error: ServerError) {
        this.error = error;
    }

    setToken = (token: string | null) => {
        console.log("Getting the token!")
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}