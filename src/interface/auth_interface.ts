export type LoginType = {
    username: string,
    password: string
}

export type RegisterType = {
    username: string;
    password: string;
    name: string;
    role: string;
}

export interface AuthInterface {
    login({username, password}: LoginType): Promise<any>;
    register({username, password, name, role}: RegisterType): Promise<any>;
    logout(): Promise<any>;
}