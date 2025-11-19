import { AppDataSource } from "../../provider/datasource-provider.js";
import { profesorSchema } from "../Profesor/schema/profesor.schema.js"; 
import ProfesorEntity from "../Profesor/entity/profesor.entity.js";
import MateriaEntity from "../Materia/entity/materia.entity.js";

const getRepository = async () => {
  const dataSource = await AppDataSource();
  return dataSource.getRepository(ProfesorEntity);
};

// Necesario para buscar la materia por ID antes de asignarla.
const getMateriaRepository = async () => {
    const dataSource = await AppDataSource();
    return dataSource.getRepository(MateriaEntity);
};

const relations = ["materias"]; 

// --- GET ALL
export const getAllProfesores = async (req, res) => {
  try {
    const repository = await getRepository();
    // Las materias se cargan automáticamente debido a eager: true en la entidad.
    const profesores = await repository.find({ relations }); 
    return res.status(200).json(profesores);
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getProfesorById = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const profesor = await repository.findOne({ 
      where: { id: parseInt(id) },
      relations
    });

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado." });
    }
    return res.status(200).json(profesor);
  } catch (error) {
    console.error(`Error al obtener Profesor ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createProfesor = async (req, res) => {
  try {
    const { error, value } = profesorSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    const nuevoProfesor = repository.create(value);
    await repository.save(nuevoProfesor);

    // Retornamos el objeto completo, que automáticamente cargará materias (vacío al inicio)
    const profesorCreado = await repository.findOne({ where: { id: nuevoProfesor.id }, relations });

    return res.status(201).json(profesorCreado);

  } catch (error) {
    console.error("Error al crear Profesor:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear el Profesor." });
  }
};

// --- PUT
export const updateProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = profesorSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const repository = await getRepository();
    const profesorAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!profesorAActualizar) {
      return res.status(404).json({ message: "Profesor no encontrado para actualizar." });
    }

    repository.merge(profesorAActualizar, value);
    await repository.save(profesorAActualizar);

    // Retorna el objeto actualizado con las relaciones cargadas
    const profesorActualizado = await repository.findOne({ where: { id: parseInt(id) }, relations });

    return res.status(200).json(profesorActualizado);

  } catch (error) {
    console.error(`Error al actualizar Profesor ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el Profesor." });
  }
};

// --- DELETE
export const deleteProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    // TypeORM también se encargará de limpiar las referencias en la tabla intermedia.
    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Profesor no encontrado para eliminar." });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error(`Error al eliminar Profesor ID ${req.params.id}:`, error);
    // Si la base de datos lanza un error de Foreign Key, el mensaje se verá aquí.
    return res.status(500).json({ message: "Error interno del servidor al eliminar el Profesor." });
  }
};

// ***************************************************************
// --- ASIGNAR MATERIA A PROFESOR (GESTIÓN MANY-TO-MANY)
// ***************************************************************
export const assignMateriaToProfesor = async (req, res) => {
  try {
    const { profesorId, materiaId } = req.params;

    const profesorRepository = await getRepository();
    const materiaRepository = await getMateriaRepository();
    
    // 1. Buscar Profesor (Es fundamental que cargue las materias para poder modificarlas)
    const profesor = await profesorRepository.findOne({ 
      where: { id: parseInt(profesorId) }, 
      relations: ["materias"] // Se asegura de cargar la relación.
    });

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado." });
    }

    // 2. Buscar Materia
    const materia = await materiaRepository.findOneBy({ id: parseInt(materiaId) });
    
    if (!materia) {
      return res.status(404).json({ message: "Materia no encontrada." });
    }

    // 3. Verificar si la relación ya existe para evitar duplicados
    const isAlreadyAssigned = profesor.materias.some(m => m.id === materia.id);
    if (isAlreadyAssigned) {
      return res.status(400).json({ message: `La Materia ID ${materiaId} ya está asignada al Profesor.` });
    }

    // 4. Asignar Materia y Guardar
    profesor.materias.push(materia);
    await profesorRepository.save(profesor); // TypeORM sincroniza la tabla intermedia

    // 5. Retornar el objeto actualizado
    return res.status(200).json({ 
      message: "Materia asignada exitosamente.",
      profesor 
    });

  } catch (error) {
    console.error("Error al asignar materia:", error);
    return res.status(500).json({ message: "Error interno del servidor al asignar la materia." });
  }
};

// ***************************************************************
// --- DESASIGNAR MATERIA DE PROFESOR (GESTIÓN MANY-TO-MANY)
// ***************************************************************
export const unassignMateriaFromProfesor = async (req, res) => {
  try {
    const { profesorId, materiaId } = req.params;

    const profesorRepository = await getRepository();
    
    // 1. Buscar Profesor (Es fundamental que cargue las materias para poder modificarlas)
    const profesor = await profesorRepository.findOne({ 
      where: { id: parseInt(profesorId) }, 
      relations: ["materias"] 
    });

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado." });
    }

    // 2. Filtrar la Materia a desasignar
    const initialLength = profesor.materias.length;
    // Sobrescribe el array de materias excluyendo la materia con el ID proporcionado
    profesor.materias = profesor.materias.filter(m => m.id !== parseInt(materiaId));

    if (profesor.materias.length === initialLength) {
      // Si la longitud no cambió, significa que el ID de materia no se encontró en el array
      return res.status(404).json({ message: `La Materia ID ${materiaId} no estaba asignada a este Profesor.` });
    }

    // 3. Guardar el Profesor (TypeORM maneja la eliminación de la fila en la tabla intermedia)
    await profesorRepository.save(profesor);

    // 4. Retornar el objeto actualizado
    return res.status(200).json({ 
      message: "Materia desasignada exitosamente.",
      profesor 
    });

  } catch (error) {
    console.error("Error al desasignar materia:", error);
    return res.status(500).json({ message: "Error interno del servidor al desasignar la materia." });
  }
};
