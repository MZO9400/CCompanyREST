import mongoose from "mongoose";

export interface User extends mongoose.Document {
    email: string,
    password: string,
    name: string,
}

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
});

export const UserModel = mongoose.model<User>("User", UserSchema);
