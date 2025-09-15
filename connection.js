import mongoose from "mongoose"

const mongoConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected")
    }catch(err) {
        console.log("Error in mongo connection:", err)
    }
}

export default mongoConnection;