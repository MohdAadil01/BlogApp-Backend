import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    if (res) {
      console.log("Connected to database");
    }
  } catch (error) {
    console.log("Error in connecting to database " + error);
  }
};

export default connectDatabase;
