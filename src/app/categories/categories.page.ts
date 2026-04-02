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
/**
 * Página de gestión de categorías.
 *
 * Permite crear, editar y eliminar categorías.
 * Al eliminar una categoría, las tareas asociadas quedan sin categoría.
 */
export class CategoriesPage {
  /** Servicio de categorías inyectado. */
  categoryService = inject(CategoryService);
  /** Servicio de tareas (usado para desvincular tareas al eliminar una categoría). */
  private taskService = inject(TaskService);
  /** Controlador de alertas de Ionic. */
  private alertCtrl = inject(AlertController);

  /** Modelo bidireccional ligado al campo de nombre de nueva categoría. */
  newCategoryName = '';
  /** Modelo bidireccional ligado al campo de color de nueva categoría. */
  newCategoryColor = '';

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, colorPaletteOutline });
  }

  /** Devuelve el color sugerido del servicio para la próxima categoría. */
  get suggestedColor(): string {
    return this.categoryService.suggestedColor;
  }

  /**
   * Crea una nueva categoría a partir del nombre y color ingresados.
   * Usa el color sugerido si el usuario no especificó uno.
   * Limpia los campos tras la creación.
   */
  addCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;
    const color = this.newCategoryColor || this.suggestedColor;
    this.categoryService.addCategory(name, color);
    this.newCategoryName = '';
    this.newCategoryColor = '';
  }

  /**
   * Muestra un diálogo para editar el nombre y color de una categoría.
   * @param id - Identificador único de la categoría.
   * @param currentName - Nombre actual (prellenado en el diálogo).
   * @param currentColor - Color actual (prellenado en el diálogo).
   */
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

  /**
   * Muestra un diálogo de confirmación antes de eliminar una categoría.
   * Al confirmar, desvincula la categoría de las tareas y luego la elimina.
   * @param id - Identificador único de la categoría.
   * @param name - Nombre de la categoría (mostrado en el mensaje de confirmación).
   */
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
