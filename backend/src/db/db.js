import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Database connected to ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log('database is not connected', error);
        process.exit(1);
    }
};

export default connectDB; 