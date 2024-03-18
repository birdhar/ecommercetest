import mongoose from "mongoose";

export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    console.log("mongoose.connection.readyState");
    return mongoose.connection.asPromise();
  } else {
    console.log("no mongoose.connection.readyState");
    const uri = process.env.MONGODB_URI;
    return mongoose.connect(uri);
  }
}
