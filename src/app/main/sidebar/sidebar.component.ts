import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public isMobile: boolean | undefined;

  constructor() {
    // On initialise avec la taille actuelle de l'écran
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const width = window.innerWidth;
    // Définir un seuil de largeur pour mobile
    this.isMobile = width < 1194;  // Par exemple, 768px pour les appareils mobiles
  }
}
