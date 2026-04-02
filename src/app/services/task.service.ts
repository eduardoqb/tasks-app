import { Injectable, signal, computed, inject } from '@angular/core';
import { Task } from '../models/task.model';
import { uniqueId } from '../utils/id';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'tasks';

/**
 * Servicio central de gestión de tareas.
 *
 * Utiliza Angular Signals para exponer el estado reactivo
 * y persiste los datos mediante `StorageService`.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageService = inject(StorageService);

  /** Signal interna que almacena la lista completa de tareas. */
  private tasksSignal = signal<Task[]>([]);

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

  /** Indica si la carga inicial desde storage ya finalizó. */
  readonly ready = signal(false);

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Crea una nueva tarea y la inserta al inicio de la lista.
   * @param title - Título de la tarea a crear.
   * @param categoryId - ID de la categoría asignada (opcional).
   */
  addTask(title: string, categoryId: string | null = null): void {
    const trimmed = title.trim();
    if (!trimmed) return;

    const id = uniqueId(this.tasksSignal().map((t) => t.id));

    const task: Task = {
      id,
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

  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Guarda el estado actual de las tareas en el almacenamiento.
   * Utiliza debounce para evitar escrituras excesivas durante
   * operaciones rápidas consecutivas (ej. marcar varias tareas).
   */
  private persist(): void {
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => {
      this.storageService.set(STORAGE_KEY, this.tasksSignal());
    }, 300);
  }

  /**
   * Carga las tareas almacenadas de forma asíncrona.
   * Normaliza tareas antiguas que no tengan `categoryId`.
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const tasks = await this.storageService.get<Task[]>(STORAGE_KEY);
      if (tasks) {
        this.tasksSignal.set(
          tasks.map((t) => ({ ...t, categoryId: t.categoryId ?? null }))
        );
      }
    } catch {
      /* storage vacío o corrupto – se mantiene el array vacío */
    } finally {
      this.ready.set(true);
    }
  }
}
