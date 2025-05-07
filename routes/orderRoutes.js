import express from "express";
import {
    createGuestOrder,
    createOrder,
    getMyOrders,
    getOrderById,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/guest", createGuestOrder);
export default router;
