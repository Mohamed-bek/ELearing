import { Router } from "express";
import { CreateVideo, GetAllVideos } from "../controllers/VideoController.js";
import { uploadVideoThumbnail } from "../middleware/multerConfig.js";
import { checkVideoAccess } from "../middleware/CoursesProtection.js";

const VideoRouter = Router();

VideoRouter.post("/video/create", uploadVideoThumbnail, CreateVideo);
VideoRouter.get("/videos", GetAllVideos);
VideoRouter.get("/videos/:id", checkVideoAccess, GetAllVideos);

export default VideoRouter;
