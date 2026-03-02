import express from "express";
import {
  getAllPegawai,
  createPegawai,
  updatePegawai,
  deletePegawai,
} from "../controllers/pegawaiController.js";

const router = express.Router();

router.get("/", getAllPegawai);
router.post("/", createPegawai);
router.put("/:id", updatePegawai);
router.delete("/:id", deletePegawai);

export default router;