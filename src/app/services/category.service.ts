import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../models/category.model';

const STORAGE_KEY = 'todo_categories';

const DEFAULT_COLORS = [
  '#4285f4', '#ea4335', '#fbbc04', '#34a853',
  '#ff6d00', '#ab47bc', '#00bcd4', '#8d6e63',
];

/**
 * Servicio de gestión de categorías.
 *
 * Utiliza Angular Signals y persiste en `localStorage`.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesSignal = signal<Category[]>(this.loadFromStorage());

  readonly categories = this.categoriesSignal.asReadonly();

  readonly categoryMap = computed(() => {
    const map = new Map<string, Category>();
    for (const cat of this.categoriesSignal()) {
      map.set(cat.id, cat);
    }
    return map;
  });

  /** Devuelve un color sugerido basado en la cantidad actual de categorías. */
  get suggestedColor(): string {
    return DEFAULT_COLORS[this.categoriesSignal().length % DEFAULT_COLORS.length];
  }

  addCategory(name: string, color: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    const category: Category = {
      id: crypto.randomUUID(),
      name: trimmed,
      color,
    };

    this.categoriesSignal.update((cats) => [...cats, category]);
    this.persist();
  }

  updateCategory(id: string, name: string, color: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;

    this.categoriesSignal.update((cats) =>
      cats.map((c) => (c.id === id ? { ...c, name: trimmed, color } : c))
    );
    this.persist();
  }

  deleteCategory(id: string): void {
    this.categoriesSignal.update((cats) => cats.filter((c) => c.id !== id));
    this.persist();
  }

  getCategoryById(id: string): Category | undefined {
    return this.categoryMap().get(id);
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categoriesSignal()));
  }

  private loadFromStorage(): Category[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
