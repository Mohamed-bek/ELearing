import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
  try {
    const { orderId, token } = req.body; // Order ID and payment token from frontend

    // Find the order in the database
    const order = await Order.findById(orderId).populate("course");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a payment with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100, // Stripe works in cents
      currency: "usd",
      payment_method: token,
      confirm: true, // Confirm payment right away
    });

    // Create a Payment record in the database
    const newPayment = new Payment({
      order: order._id,
      amount: order.price,
      currency: "usd",
      stripePaymentId: paymentIntent.id,
      status: paymentIntent.status, // Usually "succeeded"
    });

    await newPayment.save();

    // Update the order with the payment info and mark it as completed
    order.payment = newPayment._id;
    order.paymentStatus = "completed";
    await order.save();

    res
      .status(200)
      .json({ message: "Payment successful", payment: newPayment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
