import multer from "multer";
 


// * multer can store the file , photos to local storage (RAM) , 
// * but we can make the permanent storage in hard disk .... and store it.

const storage  = multer.diskStorage({


    destination(req,file,callback){
        callback(null,"upload");
    },
    filename(req,file,callback){
        callback(null, file.originalname);
    }


});
export const singleUpload = multer({storage}).single("photo");



multer().single("file")