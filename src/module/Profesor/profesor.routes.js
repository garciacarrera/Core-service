import { Router } from 'express';
import { 
  getAllProfesores, 
  getProfesorById, 
  createProfesor, 
  updateProfesor,
  deleteProfesor 
} from '../controller/profesor.controller.js';

const router = Router();

// Endpoints CRUD para la gestión de Profesores
router.get('/', getAllProfesores);
router.get('/:id', getProfesorById);
router.post('/', createProfesor);
router.put('/:id', updateProfesor);
router.delete('/:id', deleteProfesor);
router.post('/:profesorId/materias/:materiaId', assignMateriaToProfesor);

export default router;
