import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { get, create, remove } from "../../controllers/Renstra/DokumenController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/documents/renstra/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Jika user kirim 'nama_dokumen' via body, kita pakai itu + timestamp
    // Jika tidak, pakai timestamp saja
    const customName = req.body.nama_dokumen 
      ? req.body.nama_dokumen.replace(/\s+/g, '_') 
      : "DOC";
    const ext = path.extname(file.originalname);
    const uniqueName = `${customName}_${Date.now()}${ext}`;
    
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Cek duplikasi manual jika perlu (Opsional: lakukan di controller)
    cb(null, true);
  }
});

router.get("/:id?", get);
router.post("/upload", verifyToken, upload.single("file"), create);
router.delete("/:id", remove);

export default router;