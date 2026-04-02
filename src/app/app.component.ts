import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
/**
 * Componente raíz de la aplicación Ionic/Angular.
 *
 * Renderiza `<ion-app>` con un `<ion-router-outlet>` que
 * gestiona la navegación principal.
 */
export class AppComponent {}
