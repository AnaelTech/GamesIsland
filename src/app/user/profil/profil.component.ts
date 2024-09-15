import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { User } from '../../entity';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {

  public user: User | undefined;

  private route: ActivatedRoute = inject(ActivatedRoute);

  private userService: UserService = inject(UserService);

  

  constructor() { }

  ngOnInit(): void {
    this.getIdUser();
  }

  getIdUser(){
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      if (encodedId) {
        const id = Base64.decode(encodedId);
        console.log(id);
        this.userService.getUser(id).subscribe((data: User) => {
          this.user = data;
          console.log(this.user);
        });
      }
    });
  }

}
