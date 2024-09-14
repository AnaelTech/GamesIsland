import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { filter } from 'rxjs';
import { CookieService } from './shared/cookie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'GamesIsland';

  private cookieSevice = inject(CookieService);

  private TOKEN = this.cookieSevice.getCookie('BEARER'); 

  constructor(private router: Router) {}

  ngOnInit(): void {
    initFlowbite();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => initFlowbite(), 0);
      });

      this.createCorsToken();
      this.createCors();
  }


  createCors():{ headers: HttpHeaders} {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    const options: {headers: HttpHeaders} = { headers: headers };

    return options;
  }

  createCorsToken():{ headers: HttpHeaders} {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.TOKEN,
    })
    const options: {headers: HttpHeaders} = { headers: headers };

    return options;
  }

}



