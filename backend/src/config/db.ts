import colors from 'colors';
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        // console.log(process.env.MONGO_URI)
        const url = process.env.MONGO_URI ;
        const {connection} = await mongoose.connect(url)

        const url2 = `${connection.host}:${connection.port}`
        // console.log(connection)
        console.log(colors.bgBlue.black(`Database connected en ${url2}`))
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}