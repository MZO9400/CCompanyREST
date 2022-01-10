import Redis from "ioredis";

class RedisInstance {
    private static instance: RedisInstance;
    private redisInstance!: Redis.Redis;

    private constructor() {
        const redisURL: string = `${process.env.REDISURL as string}:${process.env.REDISPORT as string}`;
        this.redisInstance = new Redis(redisURL, {
            password: process.env.REDISPASS as string
        });
    }

    public static getInstance(): Redis.Redis {
        if (!RedisInstance.instance) {
            RedisInstance.instance = new RedisInstance();
        }
        return RedisInstance.instance.redisInstance;
    }
}

export default RedisInstance;
