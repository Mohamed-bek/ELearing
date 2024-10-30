import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true }, // Corrected field name from `orderId`
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    stripePaymentId: { type: String, required: true }, // Store Stripe payment reference
    status: {
      type: String,
      enum: ["succeeded", "pending", "failed"],
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = model("Payment", paymentSchema);
export default Payment;
