import UserMembership from "../models/UserMembership.js";
import cron from "node-cron";
import Payment from "../models/Payment.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createSubscription = async (req, res) => {
//   try {
//     const { customerId, paymentMethodId, price } = req.body;

//     // Attach payment method to customer
//     await stripe.paymentMethods.attach(paymentMethodId, {
//       customer: customerId,
//     });

//     // Set the default payment method on the customer
//     await stripe.customers.update(customerId, {
//       invoice_settings: { default_payment_method: paymentMethodId },
//     });

//     // Create the subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price }], // Replace with your actual price ID
//       expand: ["latest_invoice.payment_intent"],
//     });

//     res.status(200).json({ subscription });
//   } catch (error) {
//     console.error("Error creating subscription:", error);
//     res.status(400).json({ error: { message: error.message } });
//   }
// };

export const createUserMembership = async (req, res) => {
  try {
    const { userId } = req.user.id;
    const { membershipId, paymentId, endDate, autoRenew, discountCode } =
      req.body;

    const userMembership = new UserMembership({
      userId,
      membershipId,
      paymentId,
      endDate,
      autoRenew,
      discountCode,
    });

    await userMembership.save();
    res.status(201).json({ userMembership });
  } catch (error) {
    res.status(500).json({
      message: "Fail to Create A user Membership",
      err: error.message,
    });
  }
};

// Get  user memberships by userID
export const getUserMemberships = async (req, res) => {
  try {
    const { userId } = req.params;
    const memberships = await UserMembership.find({ userId }).populate(
      "membershipId"
    );
    if (memberships.length === 0)
      return res.status(404).json({ message: "User dont Have Membership" });

    res.status(200).json({ memberships });
  } catch (error) {
    res.status(500).json({
      message: "Fail To get The user Memberships",
      err: error.message,
    });
  }
};

// Get a specific user membership by ID
export const getUserMembershipById = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await UserMembership.findById(id).populate(
      "membershipId"
    );
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }
    res.status(200).json({ membership });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fail to get The Membership", err: error.message });
  }
};

// Update user membership status
export const cancelUserMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const updatedMembership = await UserMembership.findByIdAndUpdate(
      id,
      { status: "cancelled", cancellationReason },
      { new: true, runValidators: true }
    );

    if (!updatedMembership) {
      return res
        .status(404)
        .json({ success: false, message: "Membership not found" });
    }

    res.status(200).json({
      message: "The User membership canceled Successfully",
      membership: updatedMembership,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "fail to cancel The  memebership", err: error.message });
  }
};

const calculateNewEndDate = (currentEndDate, membershipId) => {
  // Fetch membership details to determine the duration (e.g., 1 month)
  // For example, let's assume the membership duration is 30 days
  const durationDays = 30; // Change this according to your business logic
  return new Date(
    currentEndDate.setDate(currentEndDate.getDate() + durationDays)
  );
};

const updateMemberships = async () => {
  try {
    const now = new Date();

    // Find memberships that are about to expire today
    const memberships = await UserMembership.find({
      endDate: { $lte: now },
      status: "active",
    });

    for (const membership of memberships) {
      // Update the status to expired
      membership.status = "expired";

      // If auto-renew is true, process the renewal
      if (membership.autoRenew) {
        const paymentDetails = {
          userId: membership.userId,
          membershipId: membership.membershipId,
          amount: membership.membership.price, // Assuming price is stored in membership
          currency: "USD", // Adjust as needed
          stripePaymentId: "", // Replace with actual Stripe payment ID after creating the payment
          status: "pending", // Set to pending while processing
        };

        // Create a new payment record
        const newPayment = await Payment.create(paymentDetails);

        // Assuming you have a function to handle the Stripe payment
        const stripePaymentResponse = await processPayment(newPayment);

        // Update the payment status based on the Stripe response
        if (stripePaymentResponse.success) {
          newPayment.status = "succeeded";
          // Calculate new end date based on membership duration (e.g., 1 month)
          membership.endDate = calculateNewEndDate(
            membership.endDate,
            membership.membershipId
          ); // You need to implement this
        } else {
          newPayment.status = "failed"; // Payment failed
          // Handle the payment failure (e.g., send notification)
        }
        await newPayment.save(); // Save the payment status

        // Update the membership status and save it
        membership.paymentId = newPayment._id; // Link to the new payment
        membership.status = "active"; // Set it back to active
      }

      await membership.save(); // Save updated membership
    }
  } catch (error) {
    console.error("Error updating memberships:", error);
  }
};

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", updateMemberships);
