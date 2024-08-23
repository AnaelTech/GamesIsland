import { Component } from '@angular/core';
import { NavbarLandingComponent } from '../../landing/navbar-landing/navbar-landing.component';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [NavbarLandingComponent],
  templateUrl: './games-list.component.html',
  styleUrl: './games-list.component.css'
})
export class GamesListComponent {

}
