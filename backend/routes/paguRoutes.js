import express from "express";
import {
  listPagu,
  getPagu,
  createPagu,
  updatePagu,
  deletePagu,
} from "../controllers/paguController.js";

const router = express.Router();

router.get("/", listPagu);
router.get("/:id", getPagu);
router.post("/", createPagu);
router.put("/:id", updatePagu);
router.delete("/:id", deletePagu);

export default router; // ⚠ WAJIB default