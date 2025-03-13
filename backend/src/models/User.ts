import mongoose from "mongoose";


export interface IUser {
    handle
    name: string;  
    email: string;
    password: string;
}


const userSchema = new mongoose.Schema({

    handle: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User