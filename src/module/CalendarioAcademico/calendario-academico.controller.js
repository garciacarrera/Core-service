import { AppDataSource } from "../../provider/datasource-provider.js";
import { calendarioAcademicoSchema } from "../CalendarioAcademico/schema/calendario-academico.entity.js"; 
import CalendarioAcademicoEntity from "../CalendarioAcademico/entity/calendario-academico.entity.js";
import CicloLectivoEntity from "../Ciclo Lectivo/entity/Ciclo-lectivo.entity.js";

// Función genérica para obtener el repositorio del Calendario
const getRepository = async () => {
  const dataSource = await AppDataSource();
  return dataSource.getRepository(CalendarioAcademicoEntity);
};

// Función genérica para obtener el repositorio del CicloLectivo (para verificar FK)
const getCicloLectivoRepository = async () => {
  const dataSource = await getDataSource();
  return dataSource.getRepository(CicloLectivoEntity);
};

// Las relaciones que queremos cargar automáticamente
const relations = ["cicloLectivo"]; 

// --- GET ALL
export const getAllCalendarios = async (req, res) => {
  try {
    const repository = await getRepository();
    const calendarios = await repository.find({ relations }); 
    return res.status(200).json(calendarios);
  } catch (error) {
    console.error("Error al obtener calendarios académicos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- GET BY ID
export const getCalendarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const calendario = await repository.findOne({ 
      where: { id: parseInt(id) },
      relations
    });

    if (!calendario) {
      return res.status(404).json({ message: "Calendario Académico no encontrado." });
    }
    return res.status(200).json(calendario);
  } catch (error) {
    console.error(`Error al obtener Calendario ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

// --- POST
export const createCalendario = async (req, res) => {
  try {
    const { error, value } = calendarioAcademicoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }

    const { ciclo_lectivo_id } = value;
    const cicloRepository = await getCicloLectivoRepository();
    
    // 1. Verificar si el Ciclo Lectivo existe
    const cicloLectivo = await cicloRepository.findOneBy({ id: ciclo_lectivo_id });
    if (!cicloLectivo) {
        return res.status(404).json({ message: `Ciclo Lectivo con ID ${ciclo_lectivo_id} no encontrado.` });
    }

    // 2. Crear y guardar el nuevo calendario
    const repository = await getRepository();
    
    // 💡 Aquí se incluye el campo 'estado' con el valor por defecto
    const dataToCreate = { 
      ...value, 
      estado: "ACTIVO" // Establecemos el valor por defecto aquí
    };

    // 3. Retornar el objeto creado con las relaciones cargadas
    const calendarioCreado = await repository.findOne({ 
      where: { id: nuevoCalendario.id }, 
      relations 
    });

    return res.status(201).json(calendarioCreado);

  } catch (error) {
    console.error("Error al crear Calendario Académico:", error);
    return res.status(500).json({ message: "Error interno del servidor al crear el calendario." });
  }
};

// --- PUT
export const updateCalendario = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = calendarioAcademicoSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        message: "Error de validación de datos.", 
        details: error.details.map(d => d.message) 
      });
    }
    
    const repository = await getRepository();
    const calendarioAActualizar = await repository.findOneBy({ id: parseInt(id) });

    if (!calendarioAActualizar) {
      return res.status(404).json({ message: "Calendario Académico no encontrado para actualizar." });
    }

    // Si se está actualizando la FK, verificar que el Ciclo Lectivo exista
    if (value.ciclo_lectivo_id) {
        const cicloRepository = await getCicloLectivoRepository();
        const cicloLectivo = await cicloRepository.findOneBy({ id: value.ciclo_lectivo_id });
        if (!cicloLectivo) {
            return res.status(404).json({ message: `Ciclo Lectivo con ID ${value.ciclo_lectivo_id} no encontrado.` });
        }
    }

    repository.merge(calendarioAActualizar, value);
    await repository.save(calendarioAActualizar);

    // Retorna el objeto actualizado con las relaciones cargadas
    const calendarioActualizado = await repository.findOne({ 
      where: { id: parseInt(id) }, 
      relations 
    });

    return res.status(200).json(calendarioActualizado);

  } catch (error) {
    console.error(`Error al actualizar Calendario ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al actualizar el calendario." });
  }
};

// --- DELETE
export const deleteCalendario = async (req, res) => {
  try {
    const { id } = req.params;
    const repository = await getRepository();
    const resultado = await repository.delete(parseInt(id));

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "Calendario Académico no encontrado para eliminar." });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error(`Error al eliminar Calendario ID ${req.params.id}:`, error);
    return res.status(500).json({ message: "Error interno del servidor al eliminar el calendario." });
  }
};
