import { Component, input, output, signal, computed } from '@angular/core';
import {
  IonList, IonItem, IonLabel, IonIcon, IonCheckbox,
  IonItemSliding, IonItemOptions, IonItemOption, IonNote, IonBadge,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, chevronDownOutline } from 'ionicons/icons';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';

/** Cantidad de tareas cargadas por página para la paginación virtual. */
const PAGE_SIZE = 20;

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    IonList, IonItem, IonLabel, IonIcon, IonCheckbox,
    IonItemSliding, IonItemOptions, IonItemOption, IonNote, IonBadge,
    IonButton
  ]
})
/**
 * Componente reutilizable que muestra una lista paginada de tareas.
 *
 * Recibe las tareas y un mapa de categorías, y emite eventos cuando
 * el usuario marca/desmarca o elimina una tarea.
 */
export class TaskListComponent {
  /** Lista de tareas a renderizar. */
  tasks = input.required<Task[]>();
  /** Título visible de la sección (ej. "Pendientes", "Completadas"). */
  title = input.required<string>();
  /** Indica si la lista muestra tareas completadas. */
  isCompleted = input(false);
  /** Mapa `id → Category` para resolver la categoría de cada tarea. */
  categoryMap = input<Map<string, Category>>(new Map());

  /** Emite el `id` de la tarea cuyo estado se alterna. */
  toggle = output<string>();
  /** Emite el `id` de la tarea a eliminar. */
  delete = output<string>();

  /** Límite actual de tareas visibles (paginación virtual). */
  private displayLimit = signal(PAGE_SIZE);

  /** Subconjunto de tareas visible según el límite de paginación. */
  readonly visibleTasks = computed(() =>
    this.tasks().slice(0, this.displayLimit())
  );

  /** Indica si existen más tareas por cargar. */
  readonly hasMore = computed(() =>
    this.tasks().length > this.displayLimit()
  );

  /** Cantidad de tareas restantes que aún no se muestran. */
  readonly remainingCount = computed(() =>
    Math.max(0, this.tasks().length - this.displayLimit())
  );

  constructor() {
    addIcons({ trashOutline, chevronDownOutline });
  }

  /** Incrementa el límite de visualización para cargar la siguiente página de tareas. */
  loadMore(): void {
    this.displayLimit.update(l => l + PAGE_SIZE);
  }

  /**
   * Resuelve la categoría asociada a una tarea.
   * @param categoryId - ID de la categoría, o `null` si no tiene.
   * @returns La categoría encontrada o `undefined`.
   */
  getCategory(categoryId: string | null): Category | undefined {
    if (!categoryId) return undefined;
    return this.categoryMap().get(categoryId);
  }

  /**
   * Abre el panel deslizable de opciones del ítem.
   * @param slidingItem - Referencia al componente `IonItemSliding`.
   */
  toggleSliding(slidingItem: IonItemSliding): void {
    slidingItem.open('end');
  }
}
