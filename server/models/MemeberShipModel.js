import { Schema, model } from "mongoose";

const membershipSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Basic", "Premium", "Pro"],
    },
    priceMonthly: {
      type: Number,
      required: true,
    },
    priceYearly: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Middleware to update the `updatedAt` field before saving
// membershipSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

const Membership = model("Membership", membershipSchema);

export default Membership;
