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

  /** Filtro activo de categoría (`null` = todas). */
  readonly categoryFilter = signal<string | null>(null);

  /** Signal de solo lectura con todas las tareas. */
  readonly tasks = this.tasksSignal.asReadonly();

  /** Tareas filtradas por la categoría seleccionada. */
  readonly filteredTasks = computed(() => {
    const filter = this.categoryFilter();
    const all = this.tasksSignal();
    return filter === null ? all : all.filter((t) => t.categoryId === filter);
  });

  /** Signal computada que devuelve únicamente las tareas pendientes (filtradas). */
  readonly pendingTasks = computed(() =>
    this.filteredTasks().filter((t) => !t.completed)
  );

  /** Signal computada que devuelve únicamente las tareas completadas (filtradas). */
  readonly completedTasks = computed(() =>
    this.filteredTasks().filter((t) => t.completed)
  );

  /** Signal computada con la cantidad de tareas pendientes. */
  readonly pendingCount = computed(() => this.pendingTasks().length);

  /**
   * Crea una nueva tarea y la inserta al inicio de la lista.
   * @param title - Título de la tarea a crear.
   * @param categoryId - ID de la categoría asignada (opcional).
   */
  addTask(title: string, categoryId: string | null = null): void {
    const trimmed = title.trim();
    if (!trimmed) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
      categoryId,
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

  /**
   * Desvincula una categoría de todas las tareas que la tengan asignada.
   * Se usa al eliminar una categoría.
   */
  removeCategoryFromTasks(categoryId: string): void {
    this.tasksSignal.update((tasks) =>
      tasks.map((t) =>
        t.categoryId === categoryId ? { ...t, categoryId: null } : t
      )
    );
    this.persist();
  }

  /** Establece el filtro de categoría activo. */
  setFilter(categoryId: string | null): void {
    this.categoryFilter.set(categoryId);
  }

  /** Guarda el estado actual de las tareas en `localStorage`. */
  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  /**
   * Carga las tareas almacenadas en `localStorage`.
   * Normaliza tareas antiguas que no tengan `categoryId`.
   */
  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const tasks: Task[] = raw ? JSON.parse(raw) : [];
      return tasks.map((t) => ({
        ...t,
        categoryId: t.categoryId ?? null,
      }));
    } catch {
      return [];
    }
  }
}
