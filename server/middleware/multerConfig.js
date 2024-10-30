import multer from "multer";

// Initialize memory storage for multer
const storage = multer.memoryStorage();

// Export a single file upload middleware
export const upload = multer({ storage }); // For single file uploads

// Export a multiple file upload middleware for video and thumbnail
export const uploadVideoThumbnail = multer({ storage }).fields([
  { name: "video", maxCount: 1 }, // Allow one video file
  { name: "thumbnail", maxCount: 1 }, // Allow one thumbnail file
]);
