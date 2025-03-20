import mongoose, { Document } from "mongoose";


export interface IUser extends Document {
    handle: string;
    name: string;  
    email: string;
    password: string;
    description: string;
    image: string;
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
    },
    description: {
        type: String,
        default: ''
    },  
    image: {
        type: String,
        default: ''
    },  
})

const User = mongoose.model<IUser>('User', userSchema)
export default User