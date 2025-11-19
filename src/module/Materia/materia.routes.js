import { Router } from 'express';
import { 
  getAllMaterias, 
  getMateriaById, 
  createMateria, 
  updateMateria,
  deleteMateria 
} from '../Materia/materia.controller.js';

const router = Router();

// Endpoints CRUD para la gestión de materias
router.get('/', getAllMaterias);
router.get('/:id', getMateriaById);
router.post('/', createMateria);
router.put('/:id', updateMateria);
router.delete('/:id', deleteMateria);

export default router;
