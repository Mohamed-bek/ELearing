import Course from "../models/Course.js";
import { s3 } from "../index.js";

export const CreateCourse = async (req, res) => {
  try {
    console.log("Starting CreateCourse");
    const { title, description, price, coach, categorys, publicshed } =
      req.body;
    // const file = req.file;

    // if (!file) {
    //   return res.status(400).json({ message: "No Image file uploaded" });
    // }
    // const uploadParams = {
    //   Bucket: process.env.DO_SPACE_NAME,
    //   Key: `images/${Date.now()}_${file.originalname}`, // Unique name
    //   Body: file.buffer,
    //   ACL: "public-read", // Make the file public
    //   ContentType: file.mimetype,
    // };

    // // Upload to DigitalOcean Space
    // const data = await s3.upload(uploadParams).promise();

    // Create COurse in the Database
    const NewCourse = new Course({
      title,
      description,
      // thumbnail: data.Location,
      price,
      coach,
      categorys,
      publicshed,
    });

    await NewCourse.save();

    res.status(201).json({
      message: "Created The Course Successfully ",
      course: NewCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ err: error.message });
  }
};

export const addVideosToCourse = async (req, res) => {
  const { id } = req.params;
  const { newVideos } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    newVideos.forEach((videoId) => {
      course.videos.push({ video: videoId });
    });

    await course.save();
    res.status(200).json({ message: "Videos added successfully.", course });
  } catch (error) {
    console.error("Error adding videos to course:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const GetCoursesByFilter = async (req, res) => {
  try {
    const { title, categorys, minPrice, maxPrice } = req.query;

    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (categorys) {
      const categoriesArray = Array.isArray(categorys)
        ? categorys
        : JSON.parse(categorys);
      filter.categorys = { $in: categoriesArray };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const courses = await Course.find(filter);

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const GetCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate({
      path: "videos.video",
      select: "title thumbnail",
    });
    if (!course) throw new Error("Course not exist");
    res.status(200).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
