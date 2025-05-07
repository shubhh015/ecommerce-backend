// routes/addressRoutes.js
import express from "express";
import {
    addAddress,
    deleteAddress,
    getAddresses,
    updateAddress,
} from "../controllers/addressController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:addressId", authMiddleware, updateAddress);
router.delete("/:addressId", authMiddleware, deleteAddress);

export default router;
