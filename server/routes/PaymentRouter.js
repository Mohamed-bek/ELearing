import { Router } from "express";
import { CreatePayment } from "../controllers/PaymentController.js";

const PaymentRouter = Router();

PaymentRouter.post("/create", CreatePayment);

export default PaymentRouter;
