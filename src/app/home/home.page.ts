import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonItem, IonIcon, IonButton, IonInput, IonSelect, IonSelectOption, IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkDoneOutline, closeCircleOutline } from 'ionicons/icons';
import { TaskService } from '../services/task.service';
import { CategoryService } from '../services/category.service';
import { TaskListComponent } from '../components/task-list/task-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    FormsModule,
    IonItem, IonIcon, IonButton, IonInput, IonSelect, IonSelectOption, IonChip,
    TaskListComponent,
  ],
})
/**
 * Página principal de la aplicación.
 *
 * Permite crear nuevas tareas (opcionalmente con categoría),
 * filtrar por categoría y gestionar las tareas existentes.
 */
export class HomePage {
  /** Servicio de tareas inyectado para gestionar el estado. */
  taskService = inject(TaskService);
  /** Servicio de categorías inyectado para poblar selectores y filtros. */
  categoryService = inject(CategoryService);

  /** Modelo bidireccional ligado al campo de entrada de nueva tarea. */
  newTaskTitle = '';
  /** ID de la categoría seleccionada para la nueva tarea (`null` = sin categoría). */
  selectedCategoryId: string | null = null;

  constructor() {
    addIcons({ addOutline, checkmarkDoneOutline, closeCircleOutline });
  }

  /**
   * Crea una nueva tarea con el título ingresado y la categoría seleccionada.
   * Limpia el campo de entrada tras la creación exitosa.
   */
  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    this.taskService.addTask(this.newTaskTitle, this.selectedCategoryId);
    this.newTaskTitle = '';
  }

  /**
   * Alterna el estado completado/pendiente de una tarea.
   * @param id - Identificador único de la tarea.
   */
  onToggle(id: string): void {
    this.taskService.toggleTask(id);
  }

  /**
   * Elimina una tarea de la lista.
   * @param id - Identificador único de la tarea.
   */
  onDelete(id: string): void {
    this.taskService.deleteTask(id);
  }

  /**
   * Aplica un filtro de categoría a la lista de tareas.
   * @param categoryId - ID de la categoría a filtrar, o `null` para mostrar todas.
   */
  setFilter(categoryId: string | null): void {
    this.taskService.setFilter(categoryId);
  }
}
