import { Component } from '@angular/core';
import { NavbarLandingComponent } from '../navbar-landing/navbar-landing.component';
import { FooterComponent } from '../../footer/footer.component';
import { RouterLink } from '@angular/router';
import { ContentComponent } from '../content/content.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NavbarLandingComponent,FooterComponent,ContentComponent ,RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

}
