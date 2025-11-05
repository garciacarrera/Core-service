import { AppDataSource } from "../../provider/datasource-provider.js";
import { planEstudioSchema } from "./schema/plan-estudio.schema.js"; 
import PlanEstudioEntity from "./entity/plan-estudio.entity.js";

const getRepository = async () => {
  const dataSource = await AppDataSource();
  return dataSource.getRepository(PlanEstudioEntity);
};

// Relaciones a cargar: Carrera (Many-to-One) y Materias (One-to-Many)
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
    const plan = await repository.findOne({ 
      where: { id: parseInt(id) },
      relations
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan de Estudio no encontrado." });
    }
    return res.status(200).json(plan);
  } catch (error) {
    console.error(`Error al obtener Plan de Estudio ID ${req.params.id}:`, error);
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

    const repository = await getRepository();
    const nuevoPlan = repository.create(value);
    await repository.save(nuevoPlan);

    // Retorna el objeto completo con las relaciones cargadas
    const planCreado = await repository.findOne({ where: { id: nuevoPlan.id }, relations });

    return res.status(201).json(planCreado);

  } catch (error) {
    console.error("Error al crear Plan de Estudio:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear el Plan de Estudio (Verifique 'carrera_id')." });
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

    // Retorna el objeto actualizado con las relaciones cargadas
    const planActualizado = await repository.findOne({ where: { id: parseInt(id) }, relations });

    return res.status(200).json(planActualizado);

  } catch (error) {
    console.error(`Error al actualizar Plan de Estudio ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el Plan de Estudio (Verifique 'carrera_id')." });
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
    console.error(`Error al eliminar Plan de Estudio ID ${req.params.id}:`, error);
    // Nota: La BD podría lanzar un error de Foreign Key si hay materias asociadas.
    return res.status(500).json({ message: "Error interno del servidor al eliminar el Plan de Estudio." });
  }
};
