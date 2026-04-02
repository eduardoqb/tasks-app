import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonItem, IonIcon, IonButton, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { TaskService } from '../services/task.service';
import { TaskListComponent } from '../components/task-list/task-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    FormsModule,
    IonItem, IonIcon, IonButton, IonInput,
    TaskListComponent,
  ],
})
/**
 * Página principal de la aplicación.
 *
 * Permite al usuario crear nuevas tareas y gestionar las existentes
 * a través de los componentes hijos de lista.
 */
export class HomePage {
  /** Servicio de tareas inyectado para gestionar el estado. */
  taskService = inject(TaskService);
  /** Modelo bidireccional ligado al campo de entrada de nueva tarea. */
  newTaskTitle = '';

  constructor() {
    addIcons({ addOutline, checkmarkDoneOutline });
  }

  /**
   * Crea una nueva tarea a partir del título ingresado.
   * Limpia el campo de entrada tras la creación exitosa.
   */
  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    this.taskService.addTask(this.newTaskTitle);
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
}
