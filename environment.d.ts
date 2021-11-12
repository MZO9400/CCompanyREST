declare namespace NodeJS {
    export interface ProcessEnv {
        MONGOURI: string;
        PORT?: string;
        SALT: string;
    }
}
