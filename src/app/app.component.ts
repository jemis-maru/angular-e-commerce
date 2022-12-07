import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'e-commerce';

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    let userData: any = localStorage.getItem('user');
    if(userData){
      this.authService.setUserData(JSON.parse(userData));
      this.authService.userSubject.next(JSON.parse(userData));
    }
  }
  
}
