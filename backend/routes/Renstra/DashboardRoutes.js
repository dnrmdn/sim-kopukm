import express from "express";
import { getDashboardStats } from "../../controllers/Renstra/DashboardController.js"; // Pastikan path 
import { verifyToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);

export default router;