import { Router } from 'express';
import { 
  getAllPeriodos, 
  getPeriodoById, 
  createPeriodo, 
  updatePeriodo,
  deletePeriodo 
} from '../Periodo/periodo.controller.js';

const router = Router();

// Endpoints CRUD para la gestión de períodos
router.get('/', getAllPeriodos);
router.get('/:id', getPeriodoById);
router.post('/', createPeriodo);
router.put('/:id', updatePeriodo);
router.delete('/:id', deletePeriodo);

export default router;
