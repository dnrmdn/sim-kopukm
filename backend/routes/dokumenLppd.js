import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* ================== STORAGE ================== */
const uploadDir = "uploads/lppd";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

/* ================== MOCK DATABASE ================== */
let data = [];
let idCounter = 1;

/* ================== GET LIST ================== */
router.get("/", (req, res) => {
  res.json({
    success: true,
    data,
  });
});

/* ================== UPLOAD ================== */
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File tidak ditemukan",
    });
  }

  const item = {
    id: idCounter++,
    name: req.body.title || req.file.originalname,
    file: req.file.filename,
    mime: req.file.mimetype,
    created_at: new Date(),
  };

  data.unshift(item);

  res.json({
    success: true,
    data: item,
  });
});

/* ================== UPDATE ================== */
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = data.find((d) => d.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Data tidak ditemukan",
    });
  }

  item.name = req.body.name || item.name;

  res.json({
    success: true,
    data: item,
  });
});

/* ================== DELETE ================== */
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  data = data.filter((d) => d.id !== id);

  res.json({ success: true });
});

/* ================== PREVIEW ================== */
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = data.find((d) => d.id === id);

  if (!item) return res.sendStatus(404);

  const filePath = path.resolve(uploadDir, item.file);
  res.sendFile(filePath);
});

export default router;
