import { Router } from 'express';
import { 
  getAllPlanesEstudio, 
  getPlanEstudioById, 
  createPlanEstudio, 
  updatePlanEstudio,
  deletePlanEstudio 
} from '../PlanEstudio/plan-estudio.controller.js';

const router = Router();

// Endpoints CRUD para la gestión de Planes de Estudio
router.get('/', getAllPlanesEstudio);
router.get('/:id', getPlanEstudioById);
router.post('/', createPlanEstudio);
router.put('/:id', updatePlanEstudio);
router.delete('/:id', deletePlanEstudio);

export default router;
