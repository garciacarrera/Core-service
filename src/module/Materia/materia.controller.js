import { getDataSource } from "../../../configuration/datasource-provider.js";
import { materiaSchema } from "../schema/materia.schema.js"; 
import MateriaEntity from "../entity/materia.entity.js";

const getRepository = async () => {
  const dataSource = await getDataSource();
  return dataSource.getRepository(MateriaEntity);
};

// RELACIONES A CARGAR: Para obtener la información completa de la materia
const relations = ["periodo", "planEstudio"];

// --- GET ALL
export const getAllMaterias = async (req, res) => {
  try {
    const repository = await getRepository();
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
    const repository = await getRepository();
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

    const repository = await getRepository();
    // Crea la entidad Materia usando los IDs de relación
    const nuevaMateria = repository.create(value);
    await repository.save(nuevaMateria);

    // Para devolver la materia con las relaciones cargadas
    const materiaCreada = await repository.findOne({ where: { id: nuevaMateria.id }, relations });

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

    const repository = await getRepository();
    const materiaAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!materiaAActualizar) {
      return res.status(404).json({ message: "Materia no encontrada para actualizar." });
    }

    repository.merge(materiaAActualizar, value);
    await repository.save(materiaAActualizar);

    // Para devolver la materia con las relaciones actualizadas y cargadas
    const materiaActualizada = await repository.findOne({ where: { id: parseInt(id) }, relations });


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
    const repository = await getRepository();
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
