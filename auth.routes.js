import express from "express";
import expressAsyncHandler from "express-async-handler";
import AuthController from "./auth.controller";
const router = express.Router();

router.post("/register", expressAsyncHandler(AuthController.register));

router.post("/login", expressAsyncHandler(AuthController.login));

export default router;
