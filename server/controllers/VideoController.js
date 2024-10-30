import { s3 } from "../index.js";
import Video from "../models/Video.js";

export const CreateVideo = async (req, res) => {
  try {
    const { title, description, links } = req.body;
    const videoFile = req.files["video"] ? req.files["video"][0] : null; // Get the video file
    const thumbnailFile = req.files["thumbnail"]
      ? req.files["thumbnail"][0]
      : null; // Get the thumbnail file

    // Check if both files are uploaded
    if (!videoFile) {
      return res.status(400).json({ message: "No video file uploaded" });
    }
    if (!thumbnailFile) {
      return res.status(400).json({ message: "No thumbnail file uploaded" });
    }

    // Upload video to DigitalOcean Space
    const videoUploadParams = {
      Bucket: process.env.DO_SPACE_NAME,
      Key: `videos/${Date.now()}_${videoFile.originalname}`, // Unique file name for video
      Body: videoFile.buffer,
      ACL: "public-read", // Make the video public if needed
      ContentType: videoFile.mimetype,
    };

    const videoData = await s3.upload(videoUploadParams).promise(); // Upload video

    // Upload thumbnail to DigitalOcean Space
    const thumbnailUploadParams = {
      Bucket: process.env.DO_SPACE_NAME,
      Key: `thumbnails/${Date.now()}_${thumbnailFile.originalname}`, // Unique file name for thumbnail
      Body: thumbnailFile.buffer,
      ACL: "public-read", // Make the thumbnail public if needed
      ContentType: thumbnailFile.mimetype,
    };

    const thumbnailData = await s3.upload(thumbnailUploadParams).promise(); // Upload thumbnail

    // Create Video in the Database
    const newVideo = new Video({
      title,
      description,
      url: videoData.Location, // Use the uploaded video URL from DigitalOcean
      thumbnail: thumbnailData.Location, // Use the uploaded thumbnail URL
      pdf,
      links: links ? JSON.parse(links) : [], // Handle links as an array
    });

    await newVideo.save(); // Save video document to MongoDB

    res.status(201).json({
      message: "Upload successful and video saved",
      video: newVideo,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ err: error.message });
  }
};

export const GetAllVideos = async (req, res) => {
  try {
    const { page = 1, NumberVideos = 14 } = req.params; // Default values for page and number of videos
    const videos = await Video.find({}, { url: 0 }) // Exclude the URL field
      .skip((page - 1) * NumberVideos)
      .limit(NumberVideos);

    res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: error.message });
  }
};

export const GetVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Prepare the response
    const videoData = {
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      pdf: video.pdf,
      links: video.links,
    };

    // Conditionally include URL based on payment status
    if (req.videoAccess) {
      videoData.url = video.url; // Include the URL only if the user has access
    }

    res.status(200).json(videoData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching video" });
  }
};

// const uploadVideo = async (file, videoData) => {
//     const formData = new FormData();
//     formData.append('video', file);
//     formData.append('title', videoData.title);
//     formData.append('description', videoData.description);
//     formData.append('thumbnail', file);
//     formData.append('pdf', videoData.pdf);
//     formData.append('links', JSON.stringify(videoData.links)); // Convert links to JSON string

//     try {
//       const response = await fetch('http://localhost:3000/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const result = await response.json();
//       console.log('Upload and save successful:', result);
//     } catch (error) {
//       console.error('Error uploading video:', error);
//     }
//   };

//   // Usage example:
//   document.getElementById('videoUpload').addEventListener('change', (e) => {
//     const file = e.target.files[0];
//     const videoData = {
//       title: 'Sample Video',
//       description: 'This is a sample description.',
//       thumbnail: 'thumbnail-url-or-path',
//       pdf: 'pdf-url-or-path',
//       links: ['https://example.com'],
//     };
//     if (file) {
//       uploadVideo(file, videoData);
//     }
//   });
