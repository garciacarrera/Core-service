import { Router } from 'express';
import { 
  getAllEstudiantes, 
  getEstudianteById, 
  createEstudiante, 
  updateEstudiante,
  deleteEstudiante 
} from '../Estudiante/estudiante.controller.js';

const router = Router();

// Endpoints CRUD para la gestión de estudiantes
router.get('/', getAllEstudiantes);
router.get('/:id', getEstudianteById);
router.post('/', createEstudiante);
router.put('/:id', updateEstudiante);
router.delete('/:id', deleteEstudiante);

export default router;
