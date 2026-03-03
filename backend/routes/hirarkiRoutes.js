import express from "express";
import { 
  getAllHirarki, 
  createHirarki, 
  updateHirarki, 
  deleteHirarki 
} from "../controllers/hirarkiController.js";

const router = express.Router();

router.get("/", getAllHirarki);        // GET /api/hirarki
router.post("/", createHirarki);       // POST /api/hirarki
router.put("/:id", updateHirarki);     // PUT /api/hirarki/1
router.delete("/:id", deleteHirarki);  // DELETE /api/hirarki/1

export default router;