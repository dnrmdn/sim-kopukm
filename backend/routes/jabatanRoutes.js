import express from "express";
import { 
  getAllJabatan, 
  getJabatanById, 
  createJabatan, 
  updateJabatan, 
  deleteJabatan 
} from "../controllers/jabatanController.js";

const router = express.Router();

// 📋 Get all positions
router.get("/", getAllJabatan);

// 🔍 Get one position by ID
router.get("/:id", getJabatanById);

// ➕ Create a new position
router.post("/", createJabatan);

// ✏️ Update a position
router.put("/:id", updateJabatan);

// 🗑️ Delete a position
router.delete("/:id", deleteJabatan);

export default router;