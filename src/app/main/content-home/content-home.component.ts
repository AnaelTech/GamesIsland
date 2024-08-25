import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-home',
  standalone: true,
  imports: [],
  templateUrl: './content-home.component.html',
  styleUrl: './content-home.component.css'
})
export class ContentHomeComponent implements OnInit {

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
    this.userService.getUser().subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
