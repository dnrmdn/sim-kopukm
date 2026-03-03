import express from "express";
import {
  getPegawai,
  createPegawai,
  updatePegawai,
  deletePegawai,
} from "../controllers/pegawaiController.js";

const router = express.Router();

router.get("/", getPegawai);
router.get("/:id", getPegawai); // ✅ TAMBAHKAN INI
router.post("/", createPegawai);
router.put("/:id", updatePegawai);
router.delete("/:id", deletePegawai);

export default router;