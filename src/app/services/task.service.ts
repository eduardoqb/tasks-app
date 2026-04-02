import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';

/** Clave utilizada en `localStorage` para persistir las tareas. */
const STORAGE_KEY = 'todo_tasks';

/**
 * Servicio central de gestión de tareas.
 *
 * Utiliza Angular Signals para exponer el estado reactivo
 * y persiste los datos en `localStorage`.
 */
@Injectable({ providedIn: 'root' })
export class TaskService {
  /** Signal interna que almacena la lista completa de tareas. */
  private tasksSignal = signal<Task[]>(this.loadFromStorage());

  /** Signal de solo lectura con todas las tareas. */
  readonly tasks = this.tasksSignal.asReadonly();

  /** Signal computada que devuelve únicamente las tareas pendientes. */
  readonly pendingTasks = computed(() =>
    this.tasksSignal().filter((t) => !t.completed)
  );

  /** Signal computada que devuelve únicamente las tareas completadas. */
  readonly completedTasks = computed(() =>
    this.tasksSignal().filter((t) => t.completed)
  );

  /** Signal computada con la cantidad de tareas pendientes. */
  readonly pendingCount = computed(() => this.pendingTasks().length);

  /**
   * Crea una nueva tarea y la inserta al inicio de la lista.
   * Ignora títulos vacíos o compuestos solo por espacios.
   * @param title - Título de la tarea a crear.
   */
  addTask(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    this.tasksSignal.update((tasks) => [task, ...tasks]);
    this.persist();
  }

  /**
   * Alterna el estado `completed` de la tarea indicada.
   * @param id - Identificador único de la tarea.
   */
  toggleTask(id: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    this.persist();
  }

  /**
   * Elimina permanentemente la tarea indicada.
   * @param id - Identificador único de la tarea.
   */
  deleteTask(id: string): void {
    this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
    this.persist();
  }

  /** Guarda el estado actual de las tareas en `localStorage`. */
  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  /**
   * Carga las tareas almacenadas en `localStorage`.
   * @returns Arreglo de tareas o un arreglo vacío si no hay datos o el JSON es inválido.
   */
  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
