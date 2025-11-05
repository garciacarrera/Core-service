import { AppDataSource } from "../../provider/datasource-provider.js";
import { estudianteSchema } from "../Estudiante/schema/estudiante.schema.js"; 
import EstudianteEntity from "../Estudiante/entity/estudiante.entity.js";

const getRepository = async () => {
  const dataSource = await AppDataSource();
  return dataSource.getRepository(EstudianteEntity);
};

// --- GET ALL
export const getAllEstudiantes = async (req, res) => {
  try {
    const repository = await getRepository();
    const estudiantes = await repository.find({
      relations: ["carrera", "materias"] 
    });
    return res.status(200).json(estudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getEstudianteById = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const estudiante = await repository.findOne({ 
      where: { id: parseInt(id) },
      relations: ["carrera", "materias"] 
    });

    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado." });
    }
    return res.status(200).json(estudiante);
  } catch (error) {
    console.error(`Error al obtener estudiante ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createEstudiante = async (req, res) => {
  try {
    const { error, value } = estudianteSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    const nuevoEstudiante = repository.create(value);
    await repository.save(nuevoEstudiante);

    return res.status(201).json(nuevoEstudiante);

  } catch (error) {
    console.error("Error al crear estudiante:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear el estudiante." });
  }
};

// --- PUT
export const updateEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = estudianteSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    const estudianteAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!estudianteAActualizar) {
      return res.status(404).json({ message: "Estudiante no encontrado para actualizar." });
    }

    repository.merge(estudianteAActualizar, value);
    const estudianteActualizado = await repository.save(estudianteAActualizar);

    return res.status(200).json(estudianteActualizado);

  } catch (error) {
    console.error(`Error al actualizar estudiante ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el estudiante." });
  }
};

// --- DELETE
export const deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado para eliminar." });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error(`Error al eliminar estudiante ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al eliminar el estudiante." });
  }
};
