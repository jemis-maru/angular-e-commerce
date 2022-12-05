import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router) {
    this.authService.userSubject.subscribe((user: any) => {
      if (user.idToken) {
        this.isLogin = true;
        if (user.role === "admin") {
          this.isAdmin = true;
        }
      }
      else {
        this.isAdmin = false;
        this.isLogin = false;
      }
    })
  }

  isLogin: boolean = false;
  isAdmin: boolean = false;

  logout(): void {
    this.authService.setUserData({});
    this.authService.userSubject.next({});
    localStorage.removeItem("user");
    this.router.navigate(['/home']);
  }

}
