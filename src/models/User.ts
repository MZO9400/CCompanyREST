import mongoose, {Model} from "mongoose";

export interface IUser extends mongoose.Document {
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

export const UserModel = mongoose.model<IUser>("UserModel", UserSchema);


const User =
    (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);
export default User;
