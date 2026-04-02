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
export class HomePage {
  taskService = inject(TaskService);
  categoryService = inject(CategoryService);

  newTaskTitle = '';
  selectedCategoryId: string | null = null;

  constructor() {
    addIcons({ addOutline, checkmarkDoneOutline, closeCircleOutline });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    this.taskService.addTask(this.newTaskTitle, this.selectedCategoryId);
    this.newTaskTitle = '';
  }

  onToggle(id: string): void {
    this.taskService.toggleTask(id);
  }

  onDelete(id: string): void {
    this.taskService.deleteTask(id);
  }

  setFilter(categoryId: string | null): void {
    this.taskService.setFilter(categoryId);
  }
}
