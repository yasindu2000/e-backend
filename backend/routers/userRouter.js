import express from "express";
import { createUser, deleteUser, getAllUsers, getUser, googleLogin, loginUser, resetPassword, sendOTP } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/",getUser)
userRouter.post("/google-login", googleLogin)
userRouter.post("/send-otp", sendOTP)
userRouter.post("/reset-password",resetPassword)
userRouter.get("/all", getAllUsers);
userRouter.delete("/:id", deleteUser);



export default userRouter;