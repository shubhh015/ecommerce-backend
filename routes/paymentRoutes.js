// routes/paymentRoutes.js
import express from "express";
import {
    createOrder,
    createRazorpayOrder,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/razorpay-order", createRazorpayOrder);
router.post("/orders", authMiddleware, createOrder);
router.post("/guest/orders", createOrder);

export default router;
