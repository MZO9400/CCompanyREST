declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGOURI: string;
            PORT?: string;
        }
    }
}

export {}
