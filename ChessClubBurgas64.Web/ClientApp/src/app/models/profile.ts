import { User } from "./user";

export interface Profile {
    username: string;
    displayName: string;
    bio?: string;
}

export class Profile implements Profile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
    }
}