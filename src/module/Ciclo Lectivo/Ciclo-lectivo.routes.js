import { Router } from "express";
import { 
    getAllCiclosLectivos, 
    getCicloLectivoById, 
    createCicloLectivo, 
    updateCicloLectivo, 
    deleteCicloLectivo 
} from "../Ciclo Lectivo/Ciclo-lectivo.controller.js"; 
const router = Router();

// Rutas base para la gestión de Ciclo Lectivo: /api/ciclos-lectivos
router.get("/", getAllCiclosLectivos); // GET /api/ciclos-lectivos
router.get("/:id", getCicloLectivoById); // GET /api/ciclos-lectivos/:id
router.post("/", createCicloLectivo); // POST /api/ciclos-lectivos
router.put("/:id", updateCicloLectivo); // PUT /api/ciclos-lectivos/:id
router.delete("/:id", deleteCicloLectivo); // DELETE /api/ciclos-lectivos/:id

export default router;
