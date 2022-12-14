import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, of, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  @ViewChild('loginForm') form!: NgForm;

  isLoginFailed: boolean = false;
  hasPassSpecialChar: boolean = true;
  isAccountDisable: boolean = false;

  passwordValidator(): void {
    if((/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(this.form.value.password))){
      this.hasPassSpecialChar = true;
    }
    else{
      this.hasPassSpecialChar = false;
    }
  }

  onSubmit(): void {
    this.http.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseConfig.apiKey, {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    })
    .pipe(
      catchError(() => {
        this.isLoginFailed = true;
        return of(false);
      })
    )
    .subscribe((response: any) => {
      if(response !== false){
        this.http.get(environment.databaseUrl + "/users.json")
          .pipe(map((data: any) => {
            let user = {};
            for (let id in data) {
              if(data[id].email === response.email){
                user = {
                  name: data[id].name,
                  email: data[id].email,
                  dob: data[id].dob,
                  role: data[id].role,
                  idToken: response.idToken,
                  isDisable: data[id].isDisable
                }
              }
            }
            return user;
          }))
          .subscribe((response: any) => {
            if(response.isDisable){
              this.isAccountDisable = true;
            }
            else{
              this.isAccountDisable = false;
              this.authService.setUserData(response);
              this.authService.userSubject.next(response);
              localStorage.setItem("user", JSON.stringify(response));
              if(!this.isLoginFailed){
                this.router.navigate(['/home'])
              }
            }
          })
      }
    })
  }

}
