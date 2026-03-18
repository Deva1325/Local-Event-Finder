import multer  from "multer";

const upload = multer({
    dest : "uploads/", // temporary storage
});

export default upload;