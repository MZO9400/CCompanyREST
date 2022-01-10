declare namespace NodeJS {
    export interface ProcessEnv {
        MONGOURI: string;
        PORT?: string;
        SALT: string;
        REDISURL: string;
        REDISPORT: string;
        REDISPASSWORD: string;
    }
}
