import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { nodeCache } from "../app.js";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017", {
      dbName: "Shopshe_v1",
    })
    .then((c) => console.log(`MongoDb Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const invalidateCache = ({
  product,
  order,
  admin,
}: InvalidateCacheProps) => {
    if(product){
        const productKey:string[] =[];
        nodeCache.del(productKey)
    }

    if(order){

    }
    if(admin){
        
    }
};
