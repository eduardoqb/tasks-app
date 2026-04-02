import { Component, input, output } from '@angular/core';
import {
  IonList, IonItem, IonLabel, IonIcon, IonCheckbox,
  IonItemSliding, IonItemOptions, IonItemOption, IonNote, IonBadge,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    IonList, IonItem, IonLabel, IonIcon, IonCheckbox,
    IonItemSliding, IonItemOptions, IonItemOption, IonNote, IonBadge,
  ],
})
export class TaskListComponent {
  tasks = input.required<Task[]>();
  title = input.required<string>();
  isCompleted = input(false);
  /** Mapa de categorías para resolver nombres y colores. */
  categoryMap = input<Map<string, Category>>(new Map());

  toggle = output<string>();
  delete = output<string>();

  constructor() {
    addIcons({ trashOutline });
  }

  getCategory(categoryId: string | null): Category | undefined {
    if (!categoryId) return undefined;
    return this.categoryMap().get(categoryId);
  }

  toggleSliding(slidingItem: IonItemSliding): void {
    slidingItem.open('end');
  }
}
