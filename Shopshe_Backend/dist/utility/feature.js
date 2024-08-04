import mongoose from "mongoose";
export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017", {
        dbName: "Shopshe_v1"
    }).then((c) => console.log(`MongoDb Connected to ${c.connection.host}`)).catch((e) => console.log(e));
};
