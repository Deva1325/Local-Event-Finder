import multer from "multer";

const upload = multer({
    dest: "uploads/", // temp storage
});

export default upload;