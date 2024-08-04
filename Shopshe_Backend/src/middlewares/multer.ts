import multer from "multer";
import { v4 as uuid } from "uuid";

// * multer can store the file , photos to local storage (RAM) ,
// * but we can make the permanent storage in hard disk .... and store it.

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "upload");
  },
  filename(req, file, callback) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`

    callback(null, fileName); 
  },
});
export const singleUpload = multer({ storage }).single("photo");

multer().single("file");
