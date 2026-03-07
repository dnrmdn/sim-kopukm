import express from "express";
import { 
  getAllRka, 
  createRka, 
  deleteRka, 
  saveBelanja,
  getBelanjaByRka, // Tambah ini
  updateRka        // Tambah ini
} from "../controllers/rkaController.js";

const router = express.Router();

/**
 * @route   GET /api/rka
 * @desc    Mengambil semua list RKA (Table & Tree view)
 */
router.get("/", getAllRka);

/**
 * @route   POST /api/rka
 * @desc    Membuat Header RKA baru
 */
router.post("/", createRka);

/**
 * @route   DELETE /api/rka/:id
 * @desc    Menghapus satu data RKA berdasarkan ID
 */
router.delete("/:id", deleteRka);

router.get("/:id/belanja", getBelanjaByRka); // Untuk ambil data belanja lama (Fungsi Edit)
router.put("/:id", updateRka);               // Untuk update header (PUT method)
/**
 * @route   POST /api/rka/:id/belanja
 * @desc    Menyimpan rincian item belanja untuk satu RKA (Bulk Insert)
 */
router.post("/:id/belanja", saveBelanja);

export default router;