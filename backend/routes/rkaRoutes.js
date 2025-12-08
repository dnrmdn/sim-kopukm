// backend/src/routes/rkaRoutes.js
import express from "express";
import * as ctrl from "../controllers/rkaController.js";

const router = express.Router();

router.get("/", ctrl.listRka);              // GET /api/rka?year=YYYY
router.post("/", ctrl.createRka);           // POST /api/rka
router.post("/:id/belanja", ctrl.addBelanja); // POST /api/rka/:id/belanja

export default router;
