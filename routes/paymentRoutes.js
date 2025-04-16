// routes/paymentRoutes.js
import express from "express";
import { createOrder } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/orders", authMiddleware, createOrder);

export default router;
