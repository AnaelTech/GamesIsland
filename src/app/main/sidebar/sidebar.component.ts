import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../entity';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public isMobile: boolean | undefined;

  public auth: AuthService = inject(AuthService);

  public user: User | undefined;

  constructor() {
    // On initialise avec la taille actuelle de l'écran
    this.checkScreenSize();
    this.getUser();
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

  getUser() {
    this.auth.getUserInfo().subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
  }
}
