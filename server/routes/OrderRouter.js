import { Router } from "express";
import { createOrder } from "../controllers/OrderController.js";
import { authenticateToken } from "../middleware/Auth.js";

const OrderRouter = Router();

OrderRouter.post("/order", authenticateToken, createOrder);

export default OrderRouter;
