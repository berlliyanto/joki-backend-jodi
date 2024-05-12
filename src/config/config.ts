import mongoose from "mongoose";


class MongoDB {

    constructor() {
        mongoose.Promise = global.Promise;
        mongoose.set('strictQuery', false);
    }

    public async connect(): Promise<void> {
        try {
            const mongo = await mongoose.connect(process.env.MONGO_URL as string);
            console.log(`MongoDB connected: ${mongo.connection.host}`);
        } catch (error) {
            console.log(error);
        }
    }
}

export default MongoDB;