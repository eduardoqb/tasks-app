import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
  IonSegment, IonSegmentButton, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, pricetagsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [
    RouterOutlet,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonSegment, IonSegmentButton, IonLabel,
  ],
})
/**
 * Componente de layout principal.
 *
 * Define la estructura visual global (header, toolbar con segmento de navegación
 * y área de contenido) y aloja las vistas hijas mediante `<router-outlet>`.
 * Sincroniza el segmento activo con la URL actual.
 */
export class LayoutComponent {
  /** Router de Angular para la navegación programática. */
  private router = inject(Router);
  /** Segmento de navegación activo (`'home'` | `'categories'`). */
  currentSegment = signal('home');

  constructor() {
    addIcons({ listOutline, pricetagsOutline });

    this.router.events.pipe(takeUntilDestroyed()).subscribe(() => {
      const segment = this.router.url.includes('categories') ? 'categories' : 'home';
      this.currentSegment.set(segment);
    });
  }

  /**
   * Maneja el cambio de segmento en la barra de navegación.
   * Actualiza el signal y navega a la ruta correspondiente.
   * @param event - Evento emitido por `IonSegment`.
   */
  onSegmentChange(event: any): void {
    const value = event.detail.value;
    this.currentSegment.set(value);
    this.router.navigate([value]);
  }
}
