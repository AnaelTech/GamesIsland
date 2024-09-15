import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home-dev.component.html',
  styleUrl: './home-dev.component.css'
})
export class HomeDevComponent {
  private auth: AuthService = inject(AuthService);

  private userService: UserService = inject(UserService);

  public user: User | undefined;

  private router: Router = inject(Router);

  constructor() { 
    
  }


  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.auth.getUserInfo().subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
