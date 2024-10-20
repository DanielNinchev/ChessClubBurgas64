import { User } from "./user";

export interface Profile {
    email: string;
    displayName: string;
    bio?: string;
}

export class Profile implements Profile {
    constructor(user: User) {
        // this.email = user.email;
        // this.displayName = `${user.firstName} ${user.lastName}`;
    }
}