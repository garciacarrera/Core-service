import { getDataSource } from "../../../configuration/datasource-provider.js";
import { carreraSchema } from "../schema/carrera.schema.js"; // Asegúrate que la ruta sea correcta
import CarreraEntity from "../entity/carrera.entity.js";

// Función auxiliar para obtener el repositorio de Carrera
const getRepository = async () => {
  const dataSource = await getDataSource();
  // El nombre de la entidad en findOneBy es 'Carrera'
  return dataSource.getRepository(CarreraEntity);
};

// --- GET ALL: Obtener todas las Carreras ---
export const getAllCarreras = async (req, res) => {
  try {
    const repository = await getRepository();
    // Usamos 'find' con 'relations' para incluir el CicloLectivo relacionado
    const carreras = await repository.find({
      relations: ["cicloLectivo"] 
    });

    return res.status(200).json(carreras);
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return res.status(500).json({ message: "Error interno del servidor al obtener las carreras." });
  }
};

// --- GET BY ID: Obtener una Carrera por ID ---
export const getCarreraById = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    // Usamos findOne para obtener la carrera y su relación
    const carrera = await repository.findOne({ 
      where: { id: parseInt(id) },
      relations: ["cicloLectivo"]
    });

    if (!carrera) {
      return res.status(404).json({ message: "Carrera no encontrada." });
    }

    return res.status(200).json(carrera);
  } catch (error) {
    console.error(`Error al obtener carrera con ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al obtener la carrera." });
  }
};

// --- POST: Crear una nueva Carrera ---
export const createCarrera = async (req, res) => {
  try {
    // 1. Validar datos con Joi Schema
    const { error, value } = carreraSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    
    // 2. Guardar el nuevo registro
    // El 'ciclo_lectivo_id' en el value se mapea automáticamente por TypeORM
    const nuevaCarrera = repository.create(value);
    await repository.save(nuevaCarrera);

    return res.status(201).json(nuevaCarrera);

  } catch (error) {
    console.error("Error al crear carrera:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear la carrera." });
  }
};

// --- PUT: Actualizar una Carrera existente ---
export const updateCarrera = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validar datos con Joi Schema
    const { error, value } = carreraSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    
    // 2. Buscar si la Carrera existe
    const carreraAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!carreraAActualizar) {
      return res.status(404).json({ message: "Carrera no encontrada para actualizar." });
    }

    // 3. Actualizar el objeto y guardar
    repository.merge(carreraAActualizar, value);
    const carreraActualizada = await repository.save(carreraAActualizar);

    return res.status(200).json(carreraActualizada);

  } catch (error) {
    console.error(`Error al actualizar carrera con ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar la carrera." });
  }
};

// --- DELETE: Eliminar una Carrera ---
export const deleteCarrera = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();

    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Carrera no encontrada para eliminar." });
    }

    return res.status(204).send(); // 204 No Content

  } catch (error) {
    console.error(`Error al eliminar carrera con ID ${req.params.id}:`, error);
    // Nota: Si hay Planes de Estudio relacionados, la base de datos podría tirar un error de clave foránea.
    return res.status(500).json({ message: "Error interno del servidor al eliminar la carrera (puede haber Planes de Estudio relacionados)." });
  }
};
