import { Router } from "express";
import {
  CreateNewPrice,
  deletePrice,
  getAllPrices,
  UpdatePrice,
} from "../controllers/PriceController.js";
import { authenticateToken, authorizeRoles } from "../middleware/Auth.js";

const PriceRouter = Router();

PriceRouter.post(
  "/price",
  authenticateToken,
  authorizeRoles(["admin"]),
  CreateNewPrice
);
PriceRouter.put(
  "/price/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  UpdatePrice
);
PriceRouter.delete(
  "/price/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  deletePrice
);
PriceRouter.get("/prices", getAllPrices);

export default PriceRouter;
