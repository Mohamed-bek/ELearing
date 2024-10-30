import Price from "../models/Price.js";

export const CreateNewPrice = async (req, res) => {
  try {
    const { price, description } = req.body;
    const Newprice = await Price.create({ price, description });
    res
      .status(200)
      .json({ price: Newprice, message: "New price Created Successfully " });
  } catch (error) {
    res.status(404).json({ message: "Prices not found", err: error.message });
  }
};

export const getAllPrices = async (req, res) => {
  try {
    const prices = await Price.find();
    res.status(200).json({ prices });
  } catch (error) {
    res.status(404).json({ message: "Prices not found", err: error.message });
  }
};

export const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const price = await Price.findById(id);
    if (!price) return res.status(404).json({ message: "Price not found" });
    await price.deleteOne();
    res.status(200).json({ message: "Price Deleted Succesfuly" });
  } catch (error) {
    res.status(404).json({ message: "Prices not Dleted", err: error.message });
  }
};

export const UpdatePrice = async (req, res) => {
  try {
    const { price, description } = req.body;
    const { id } = req.params;
    let NewInfo = {};
    if (price) NewInfo.price = price;
    if (description) NewInfo.description = description;
    const newPrice = await Price.findByIdAndUpdate(id, NewInfo, { new: true });
    res
      .status(200)
      .json({ message: "Price Updated Succesfully", price: newPrice });
  } catch (error) {
    res.status(404).json({ message: "Prices not Updated", err: error.message });
  }
};
