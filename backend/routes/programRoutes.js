// backend/src/routes/programRoutes.js
import express from "express";
import * as ctrl from "../controllers/programController.js";

const router = express.Router();

// programs (mounted at /api/programs or /api/renstra depending server.js)
router.get("/", ctrl.listPrograms);
router.post("/", ctrl.createProgram);
router.patch("/:id", ctrl.updateProgram);
router.delete("/:id", ctrl.deleteProgram);

// kegiatans
router.post("/kegiatans", ctrl.createKegiatan);
router.patch("/kegiatans/:id", ctrl.updateKegiatan);
router.delete("/kegiatans/:id", ctrl.deleteKegiatan);

// subkegiatans
router.post("/subkegiatans", ctrl.createSub);
router.patch("/subkegiatans/:id", ctrl.updateSub);
router.delete("/subkegiatans/:id", ctrl.deleteSub);

export default router;
