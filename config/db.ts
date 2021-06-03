const mongoose = require("mongoose");
const config = require("config");
const db: string = config.get("mongoURI");

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export = connectDB;
