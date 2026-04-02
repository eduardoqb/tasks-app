import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [RouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon],
})
/**
 * Componente de layout principal.
 *
 * Define la estructura visual global (header, toolbar y área de contenido)
 * y aloja las vistas hijas mediante `<router-outlet>`.
 */
export class LayoutComponent {
  constructor() {
    addIcons({ listOutline });
  }
}
