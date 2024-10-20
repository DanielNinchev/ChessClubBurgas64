export interface User {
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    token: string;
    isAdmin: boolean;
}

export interface UserFormValues {
    email: string;
    password: string;
}