import multer from "multer";

const storage = multer.memoryStorage();

export const imageUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only images are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

export const videoUpload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm","video/mov", "video/avi", "video/mkv"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only videos are allowed"), false);

    } else {
      cb(null, true);
    }
    },
});
