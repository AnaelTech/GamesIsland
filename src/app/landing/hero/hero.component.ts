import { Component } from '@angular/core';
import { NavbarLandingComponent } from '../navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavbarLandingComponent,FooterComponent, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
