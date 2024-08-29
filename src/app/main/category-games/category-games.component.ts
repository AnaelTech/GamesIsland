import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../entity';
import { AuthService } from '../../shared/auth.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-category-games',
  standalone: true,
  imports: [],
  templateUrl: './category-games.component.html',
  styleUrl: './category-games.component.css'
})
export class CategoryGamesComponent implements OnInit {
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

  goToDetail(id: string) {
    this.router.navigate(['home/games/'+id]);
  }

}
