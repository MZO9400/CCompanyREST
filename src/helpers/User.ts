import User from "../models/User";

export const emailExists = async (email: string): Promise<boolean> => {
    const user = await User.findOne({email});
    return !!user;
};
