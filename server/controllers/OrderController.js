import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { course } = req.body;
    const userId = req.user.id;
    if (!userId)
      return res.status(401).json({ error: "You have to create an account" });
    const newOrder = new Order({
      user: userId,
      course,
    });

    await newOrder.save();
    res.status(201).json({ order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
