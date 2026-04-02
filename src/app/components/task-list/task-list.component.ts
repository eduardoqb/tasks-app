import { Component, input, output } from '@angular/core';
import {
  IonList, IonItem, IonLabel, IonIcon, IonCheckbox,
  IonItemSliding, IonItemOptions, IonItemOption, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    IonList, IonItem, IonLabel, IonIcon, IonCheckbox,
    IonItemSliding, IonItemOptions, IonItemOption, IonNote,
  ],
})
/**
 * Componente reutilizable que muestra una lista de tareas.
 *
 * Recibe las tareas y emite eventos cuando el usuario
 * marca/desmarca o elimina una tarea.
 */
export class TaskListComponent {
  /** Lista de tareas a renderizar. */
  tasks = input.required<Task[]>();
  /** Título visible de la sección (ej. "Pendientes", "Completadas"). */
  title = input.required<string>();
  /** Indica si la lista muestra tareas completadas. */
  isCompleted = input(false);

  /** Emite el `id` de la tarea cuyo estado se alterna. */
  toggle = output<string>();
  /** Emite el `id` de la tarea a eliminar. */
  delete = output<string>();

  constructor() {
    addIcons({ trashOutline });
  }

  /**
   * Abre el panel deslizable de opciones del ítem.
   * @param slidingItem - Referencia al componente `IonItemSliding`.
   */
  toggleSliding(slidingItem: IonItemSliding): void {
    slidingItem.open('end');
  }
}
