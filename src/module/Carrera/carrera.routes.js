import { Router } from 'express';
import { 
  getAllCarreras, 
  getCarreraById, 
  createCarrera, 
  updateCarrera,
  deleteCarrera 
} from '../Carrera/carrera.controller.js';

const router = Router();

// Endpoint: GET /api/v1/carreras
router.get('/', getAllCarreras);

// Endpoint: GET /api/v1/carreras/:id
router.get('/:id', getCarreraById);

// Endpoint: POST /api/v1/carreras
router.post('/', createCarrera);

// Endpoint: PUT /api/v1/carreras/:id
router.put('/:id', updateCarrera);

// Endpoint: DELETE /api/v1/carreras/:id
router.delete('/:id', deleteCarrera);

export default router;
