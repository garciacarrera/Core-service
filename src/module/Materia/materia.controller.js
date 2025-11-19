import AppDataSource from "../../provider/datasource-provider.js";
import { materiaSchema } from "./schema/materia.schema.js";
import MateriaEntity from "./entity/materia.entity.js";
import PeriodoEntity from "../Periodo/entity/periodo.entity.js";
import PlanEstudioEntity from "../PlanEstudio/entity/plan-estudio.entity.js";

// ⚡ Ahora el repositorio se obtiene directamente del DataSource (sin llamar a la función)
const repository = AppDataSource.getRepository(MateriaEntity);
const periodoRepository = AppDataSource.getRepository(PeriodoEntity);
const planEstudioRepository = AppDataSource.getRepository(PlanEstudioEntity);

// Relaciones a cargar
const relations = ["periodo", "planEstudio"];

// --- GET ALL
export const getAllMaterias = async (req, res) => {
  try {
    const materias = await repository.find({ relations });
    return res.status(200).json(materias);
  } catch (error) {
    console.error("Error al obtener materias:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getMateriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const materia = await repository.findOne({
      where: { id: parseInt(id) },
      relations
    });

    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrada." });
    }
    return res.status(200).json(materia);
  } catch (error) {
    console.error(`Error al obtener materia ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createMateria = async (req, res) => {
  try {
    const { error, value } = materiaSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Error de validación de datos.",
        details: error.details.map(d => d.message)
      });
    }

    // Verificar relaciones
    const periodo = await periodoRepository.findOneBy({ id: value.periodo_id });
    if (!periodo) {
      return res.status(404).json({ message: `No existe un Periodo con id ${value.periodo_id}` });
    }

    const planEstudio = await planEstudioRepository.findOneBy({ id: value.plan_estudio_id });
    if (!planEstudio) {
      return res.status(404).json({ message: `No existe un Plan de Estudio con id ${value.plan_estudio_id}` });
    }

    const nuevaMateria = repository.create({
      nombre: value.nombre,
      horas_catedra: value.horas_catedra,
      periodo,
      planEstudio
    });

    await repository.save(nuevaMateria);

    const materiaCreada = await repository.findOne({
      where: { id: nuevaMateria.id },
      relations
    });

    return res.status(201).json(materiaCreada);
  } catch (error) {
    console.error("Error al crear materia:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear la materia." });
  }
};

// --- PUT
export const updateMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = materiaSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: "Error de validación de datos.",
        details: error.details.map(d => d.message)
      });
    }

    const materiaAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!materiaAActualizar) {
      return res.status(404).json({ message: "Materia no encontrada para actualizar." });
    }

    repository.merge(materiaAActualizar, value);
    await repository.save(materiaAActualizar);

    const materiaActualizada = await repository.findOne({
      where: { id: parseInt(id) },
      relations
    });

    return res.status(200).json(materiaActualizada);
  } catch (error) {
    console.error(`Error al actualizar materia ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar la materia." });
  }
};

// --- DELETE
export const deleteMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Materia no encontrada para eliminar." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(`Error al eliminar materia ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al eliminar la materia." });
  }
};
