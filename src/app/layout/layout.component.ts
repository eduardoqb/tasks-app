import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
  IonSegment, IonSegmentButton, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, pricetagsOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

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
export class LayoutComponent {
  currentSegment = 'home';

  constructor(private router: Router) {
    addIcons({ listOutline, pricetagsOutline });

    this.router.events.subscribe(() => {
      if (this.router.url.includes('categories')) {
        this.currentSegment = 'categories';
      } else {
        this.currentSegment = 'home';
      }
    });
  }

  onSegmentChange(event: any): void {
    const value = event.detail.value;
    this.currentSegment = value;
    this.router.navigate([value]);
  }
}
