import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disk storage configuration
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Memory storage for smaller files (images)
const memoryStorage = multer.memoryStorage();

export const imageUpload = multer({
  storage: memoryStorage,
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
  storage: diskStorage,
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

// Unified multer middleware for posts (image or video)
export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB (max for video)
  },

  fileFilter: (req, file, cb) => {
    const allowedImages = ["image/jpeg", "image/png", "image/jpg"];
    const allowedVideos = ["video/mp4", "video/webm", "video/mov", "video/avi", "video/mkv"];
    const allAllowed = [...allowedImages, ...allowedVideos];
    
    if (!allAllowed.includes(file.mimetype)) {
      cb(new Error("Only images and videos are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

// Error handler middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size is too large! Maximum allowed size is 50 MB for videos and 10 MB for images.'
      });
    }
    return res.status(400).json({
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message || 'File upload failed'
    });
  }
  next();
};
