import mongoose from 'mongoose';
import { MONGO_URI } from '../Utils/constant/constant';

class ServerDB {
    constructor() {}

    public connectDB() {
        console.log("Connecting DB...");
        mongoose.connect(`${MONGO_URI}`, {}).then(() => console.log("DB connected successfuly")).catch((e) => console.log('Error when connect DB', e))
    }
}

export default new ServerDB();