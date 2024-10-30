import { Schema, model } from "mongoose";

const priceSchema = new Schema({
  price: {
    month: {
      type: Number,
      required: [true, "The Month Price is Required"],
    },
    year: {
      type: Number,
      required: [true, "The Year Price is Required"],
    },
  },
  description: {
    type: String,
    required: [true, "The Description Price is Required"],
  },
});

const Price = model("Price", priceSchema);

export default Price;
