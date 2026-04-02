/**
 * Representa una categoría para agrupar tareas.
 */
export interface Category {
  /** Identificador único generado con `crypto.randomUUID()`. */
  id: string;
  /** Nombre descriptivo de la categoría. */
  name: string;
  /** Color asociado para identificación visual (hex o nombre CSS). */
  color: string;
}
