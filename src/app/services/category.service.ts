import { Injectable, signal, computed, inject } from '@angular/core';
import { Category } from '../models/category.model';
import { uniqueId } from '../utils/id';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'categories';

/** Paleta de colores predeterminados asignados cíclicamente a nuevas categorías. */
const DEFAULT_COLORS = [
  '#4285f4', '#ea4335', '#fbbc04', '#34a853',
  '#ff6d00', '#ab47bc', '#00bcd4', '#8d6e63',
];

/**
 * Servicio de gestión de categorías.
 *
 * Utiliza Angular Signals y persiste mediante `StorageService`.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private storageService = inject(StorageService);

  /** Signal interna que almacena la lista completa de categorías. */
  private categoriesSignal = signal<Category[]>([]);

  /** Signal de solo lectura con todas las categorías. */
  readonly categories = this.categoriesSignal.asReadonly();

  /** Mapa computado `id → Category` para búsquedas rápidas por identificador. */
  readonly categoryMap = computed(() => {
    const map = new Map<string, Category>();
    for (const cat of this.categoriesSignal()) {
      map.set(cat.id, cat);
    }
    return map;
  });

  /** Indica si la carga inicial desde storage ya finalizó. */
  readonly ready = signal(false);

  /** Devuelve un color sugerido basado en la cantidad actual de categorías. */
  get suggestedColor(): string {
    return DEFAULT_COLORS[this.categoriesSignal().length % DEFAULT_COLORS.length];
  }

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Crea una nueva categoría y la agrega al final de la lista.
   * Ignora nombres vacíos o compuestos solo por espacios.
   * @param name - Nombre de la categoría.
   * @param color - Color asociado en formato hex o nombre CSS.
   */
  addCategory(name: string, color: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    const id = uniqueId(this.categoriesSignal().map((c) => c.id));

    const category: Category = {
      id,
      name: trimmed,
      color,
    };

    this.categoriesSignal.update((cats) => [...cats, category]);
    this.persist();
  }

  /**
   * Actualiza el nombre y color de una categoría existente.
   * Ignora nombres vacíos o compuestos solo por espacios.
   * @param id - Identificador único de la categoría.
   * @param name - Nuevo nombre.
   * @param color - Nuevo color.
   */
  updateCategory(id: string, name: string, color: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    this.categoriesSignal.update((cats) =>
      cats.map((c) => (c.id === id ? { ...c, name: trimmed, color } : c))
    );
    this.persist();
  }

  /**
   * Elimina permanentemente la categoría indicada.
   * @param id - Identificador único de la categoría.
   */
  deleteCategory(id: string): void {
    this.categoriesSignal.update((cats) => cats.filter((c) => c.id !== id));
    this.persist();
  }

  /**
   * Obtiene una categoría por su identificador.
   * @param id - Identificador único de la categoría.
   * @returns La categoría encontrada o `undefined` si no existe.
   */
  getCategoryById(id: string): Category | undefined {
    return this.categoryMap().get(id);
  }

  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Guarda el estado actual de las categorías en el almacenamiento.
   * Utiliza debounce de 300 ms para evitar escrituras excesivas.
   */
  private persist(): void {
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => {
      this.storageService.set(STORAGE_KEY, this.categoriesSignal());
    }, 300);
  }

  /**
   * Carga las categorías almacenadas de forma asíncrona.
   * @returns Arreglo de categorías o un arreglo vacío si no hay datos.
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const categories = await this.storageService.get<Category[]>(STORAGE_KEY);
      if (categories) {
        this.categoriesSignal.set(categories);
      }
    } catch {
      /* storage vacío o corrupto – se mantiene el array vacío */
    } finally {
      this.ready.set(true);
    }
  }
}
