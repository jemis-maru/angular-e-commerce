import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
// import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {
    this.user = authService.getUserData();
  }
  
  user: any = {};

  resetPassword(): void {
    this.http.post<any>("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="+environment.firebaseConfig.apiKey, {
      requestType: "PASSWORD_RESET",
      email: this.user.email
    }).subscribe((response: any) => {
      console.log(response);
      this.authService.setUserData({});
      this.authService.userSubject.next({});
      localStorage.removeItem("user");
      this.router.navigate(['/login']);
    })
  }

  // changePasswordForm = new FormGroup({
  //   "password": new FormControl("", [Validators.required, Validators.minLength(6), this.passwordValidator]),
  //   "confirmPassword": new FormControl("", [Validators.required, Validators.minLength(6), this.passwordValidator]),
  // }, this.confirmPasswordValidator);


  // passwordValidator(control: FormControl): { isPasswordValid: boolean } | null {
  //   if(control.value != "" && !(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(control.value))){
  //     return { isPasswordValid: false }
  //   }
  //   return null;
  // }

  // confirmPasswordValidator(control: AbstractControl) {
  //   if(control.get('confirmPassword')?.value != "" && control.get('password')?.value != control.get('confirmPassword')?.value){
  //     return { isPassAndConfirmPassMatch: false }
  //   }
  //   return null;
  // }

  // onSubmit(): void {
    // this.http.post<any>("https://identitytoolkit.googleapis.com/v1/accounts:update?key="+environment.firebaseConfig.apiKey, {
    //   idToken: this.user.idToken,
    //   password: this.changePasswordForm.value.password,
    //   returnSecureToken: true,
    // }).subscribe((response: any) => {
    //   this.authService.setUserData({});
    //   this.authService.userSubject.next({});
    //   localStorage.removeItem("user");
    //   this.router.navigate(['/login']);
    // })
  // }
}
