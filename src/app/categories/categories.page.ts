import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonList, IonItem, IonLabel, IonIcon, IonButton, IonInput,
  IonItemSliding, IonItemOptions, IonItemOption,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, colorPaletteOutline } from 'ionicons/icons';
import { CategoryService } from '../services/category.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  imports: [
    FormsModule,
    IonList, IonItem, IonLabel, IonIcon, IonButton, IonInput,
    IonItemSliding, IonItemOptions, IonItemOption,
  ],
})
export class CategoriesPage {
  categoryService = inject(CategoryService);
  private taskService = inject(TaskService);
  private alertCtrl = inject(AlertController);

  newCategoryName = '';
  newCategoryColor = '';

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, colorPaletteOutline });
  }

  get suggestedColor(): string {
    return this.categoryService.suggestedColor;
  }

  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    const color = this.newCategoryColor || this.suggestedColor;
    this.categoryService.addCategory(name, color);
    this.newCategoryName = '';
    this.newCategoryColor = '';
  }

  async editCategory(id: string, currentName: string, currentColor: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar categoría',
      inputs: [
        { name: 'name', type: 'text', value: currentName, placeholder: 'Nombre' },
        { name: 'color', type: 'text', value: currentColor, placeholder: 'Color (ej. #4285f4)' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name?.trim()) {
              this.categoryService.updateCategory(id, data.name, data.color || currentColor);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmDelete(id: string, name: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar "${name}"? Las tareas asociadas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.taskService.removeCategoryFromTasks(id);
            this.categoryService.deleteCategory(id);
          },
        },
      ],
    });
    await alert.present();
  }
}
