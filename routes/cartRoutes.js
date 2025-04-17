import express from "express";
import {
    addOrUpdateItem,
    emptyCart,
    getCart,
    removeItem,
    updateShipping,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/item", authMiddleware, addOrUpdateItem);
router.delete("/item/:productId", authMiddleware, removeItem);
router.delete("/", authMiddleware, emptyCart);
router.patch("/shipping", authMiddleware, updateShipping);

export default router;
