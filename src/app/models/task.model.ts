/**
 * Representa una tarea dentro de la aplicación.
 */
export interface Task {
  /** Identificador único generado con `crypto.randomUUID()`. */
  id: string;
  /** Título descriptivo de la tarea. */
  title: string;
  /** Indica si la tarea ha sido completada. */
  completed: boolean;
  /** Marca de tiempo (epoch ms) de creación de la tarea. */
  createdAt: number;
}
