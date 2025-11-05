import { getDataSource } from "../../../configuration/datasource-provider.js";
import { periodoSchema } from "../schema/periodo.schema.js"; 
import PeriodoEntity from "../entity/periodo.entity.js";

const getRepository = async () => {
  const dataSource = await getDataSource();
  return dataSource.getRepository(PeriodoEntity);
};

// RELACIONES A CARGAR: Carga las materias relacionadas con el período.
const relations = ["materias"];

// --- GET ALL
export const getAllPeriodos = async (req, res) => {
  try {
    const repository = await getRepository();
    const periodos = await repository.find({ relations });
    return res.status(200).json(periodos);
  } catch (error) {
    console.error("Error al obtener períodos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getPeriodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const periodo = await repository.findOne({ 
      where: { id: parseInt(id) },
      relations
    });

    if (!periodo) {
      return res.status(404).json({ message: "Período no encontrado." });
    }
    return res.status(200).json(periodo);
  } catch (error) {
    console.error(`Error al obtener período ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createPeriodo = async (req, res) => {
  try {
    const { error, value } = periodoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    const nuevoPeriodo = repository.create(value);
    await repository.save(nuevoPeriodo);

    return res.status(201).json(nuevoPeriodo);

  } catch (error) {
    console.error("Error al crear período:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear el período." });
  }
};

// --- PUT
export const updatePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = periodoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    const periodoAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!periodoAActualizar) {
      return res.status(404).json({ message: "Período no encontrado para actualizar." });
    }

    repository.merge(periodoAActualizar, value);
    const periodoActualizado = await repository.save(periodoAActualizar);

    return res.status(200).json(periodoActualizado);

  } catch (error) {
    console.error(`Error al actualizar período ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el período." });
  }
};

// --- DELETE
export const deletePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Período no encontrado para eliminar." });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error(`Error al eliminar período ID ${req.params.id}:`, error);
    // Nota: La BD podría lanzar un error de Foreign Key si hay materias asociadas.
    return res.status(500).json({ message: "Error interno del servidor al eliminar el período." });
  }
};
