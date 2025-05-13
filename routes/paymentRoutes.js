// routes/paymentRoutes.js
import express from "express";
import { createOrder } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/orders", createOrder);

export default router;
