import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  updateAll,
  removeAll
} from "../../controllers/Renstra/SubKegiatanAnggaranController.js";

const router = express.Router();

// router.js lo jadi gini:

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);

// PINDAH KE SINI (DI ATAS /:id)
router.put("/update-all/:subKegiatanId", updateAll); 

// Route ini taruh di bawah karena sifatnya general (nangkep apa aja setelah /)
router.put("/:id", update); 

router.delete("/remove-all/:subKegiatanId", removeAll);

router.delete("/:id", remove);

export default router;