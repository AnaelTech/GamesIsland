import { Component } from '@angular/core';
import { NavbarLandingComponent } from '../navbar-landing/navbar-landing.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavbarLandingComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
