import AppDataSource from "../../provider/datasource-provider.js";
import { planEstudioSchema } from "./schema/plan-estudio.schema.js"; 
import PlanEstudioEntity from "./entity/plan-estudio.entity.js";
import CarreraEntity from "../Carrera/entity/carrera.entity.js";

const getRepository = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(PlanEstudioEntity);
};

// Relaciones
const relations = ["carrera", "materias"];

// --- GET ALL
export const getAllPlanesEstudio = async (req, res) => {
  try {
    const repository = await getRepository();
    const planes = await repository.find({ relations });
    return res.status(200).json(planes);
  } catch (error) {
    console.error("Error al obtener planes de estudio:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getPlanEstudioById = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const plan = await repository.findOne({ where: { id: parseInt(id) }, relations });

    if (!plan) {
      return res.status(404).json({ message: "Plan de Estudio no encontrado." });
    }
    return res.status(200).json(plan);
  } catch (error) {
    console.error(`Error al obtener Plan Estudio ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createPlanEstudio = async (req, res) => {
  try {
    const { error, value } = planEstudioSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Error de validación de datos.",
        details: error.details.map(d => d.message)
      });
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(PlanEstudioEntity);
    const carreraRepo = AppDataSource.getRepository(CarreraEntity);

    // 1) Buscar carrera
    const carrera = await carreraRepo.findOneBy({ id: value.carrera_id });

    if (!carrera) {
      return res.status(404).json({
        message: `No existe una Carrera con id ${value.carrera_id}`
      });
    }

    // 2) Crear plan
    const nuevoPlan = repository.create({
      nombre: value.nombre,
      anio_educativo: value.anio_educativo,
      carrera: carrera
    });

    await repository.save(nuevoPlan);

    // 3) Retornar con relaciones
    const planCreado = await repository.findOne({
      where: { id: nuevoPlan.id },
      relations
    });

    return res.status(201).json(planCreado);

  } catch (error) {
    console.error("Error al crear Plan de Estudio:", error);
    return res.status(500).json({
      message: "Error interno del servidor al crear el Plan de Estudio (Verifique 'carrera_id')."
    });
  }
};

// --- PUT
export const updatePlanEstudio = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = planEstudioSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.",
        details: error.details.map(d => d.message)
      });
    }

    const repository = await getRepository();
    const planAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!planAActualizar) {
      return res.status(404).json({ message: "Plan de Estudio no encontrado para actualizar." });
    }

    repository.merge(planAActualizar, value);
    await repository.save(planAActualizar);

    const planActualizado = await repository.findOne({ where: { id: parseInt(id) }, relations });
    return res.status(200).json(planActualizado);

  } catch (error) {
    console.error(`Error al actualizar Plan Estudio ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- DELETE
export const deletePlanEstudio = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Plan de Estudio no encontrado para eliminar." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar Plan Estudio ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al eliminar el Plan de Estudio." });
  }
};
