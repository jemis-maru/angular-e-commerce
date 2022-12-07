import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-users-tab',
  templateUrl: './users-tab.component.html',
  styleUrls: ['./users-tab.component.scss']
})
export class UsersTabComponent {
  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.fetchUsers();
  }
  
  users: any = [];

  fetchUsers(): void {
    this.http.get<any>(environment.databaseUrl + "/users.json")
      .pipe(map((data: any) => {
        let userArr = [];
        for (let id in data) {
          userArr.push({
            id,
            name: data[id].name,
            email: data[id].email,
            dob: data[id].dob,
            role: data[id].role,
            isDisable: data[id]?.isDisable ? data[id]?.isDisable : false,
          });
        }
        return userArr;
      }))
      .subscribe((response: any) => {
        this.users = response;
      });
  }

  editUser(user: any): void {
    this.userService.setUser(user);
    this.router.navigate(["/edit-user"]);
  }

  changeUserDisable(id: string, flag: boolean): void {
    this.http.patch<any>(environment.databaseUrl + `/users/${id}.json`, {
      isDisable: flag
    })
      .subscribe(() => {
        this.fetchUsers();
      })
  }

}
