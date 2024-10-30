import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, courseId, price } = req.body;

    const newOrder = new Order({
      user: userId,
      course: courseId,
      price,
    });

    await newOrder.save();
    res.status(201).json({ order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
