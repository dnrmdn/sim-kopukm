import express from "express";
import {
  getPrograms,
  getKegiatan,
  getSubKegiatan,
  getPegawai,
  getPagu,
  getSatuan
} from "../controllers/masterController.js";

const router = express.Router();

/**
 * @route   GET /api/master/programs
 * @desc    Ambil semua data Program Renstra
 */
router.get("/programs", getPrograms);

/**
 * @route   GET /api/master/kegiatan
 * @desc    Ambil data Kegiatan (Filterable by program_id)
 */
router.get("/kegiatan", getKegiatan);

/**
 * @route   GET /api/master/sub-kegiatan
 * @desc    Ambil data Sub-Kegiatan (Filterable by kegiatan_id)
 */
router.get("/sub-kegiatan", getSubKegiatan);

/**
 * @route   GET /api/master/pegawai
 * @desc    Ambil data Pegawai dan Jabatannya
 */
router.get("/pegawai", getPegawai);

/**
 * @route   GET /api/master/pagu
 * @desc    Ambil referensi jenis Pagu
 */
router.get("/pagu", getPagu);

/**
 * @route   GET /api/master/satuan
 * @desc    Ambil list Satuan unik dari sub-kegiatan
 */
router.get("/satuan", getSatuan);

export default router;