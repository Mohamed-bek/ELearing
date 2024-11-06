// routes/userMembershipRoutes.js
import { Router } from "express";
import {
  createUserMembership,
  getUserMemberships,
  getUserMembershipById,
  cancelUserMembership,
} from "../controllers/userMembershipController.js";

const UserMembershipRouter = Router();

UserMembershipRouter.post("/user-memberships", createUserMembership);
UserMembershipRouter.get("/user-memberships/:userId", getUserMemberships);
UserMembershipRouter.get(
  "/user-memberships/details/:id",
  getUserMembershipById
);
UserMembershipRouter.put("/user-memberships/status/:id", cancelUserMembership);

export default UserMembershipRouter;
