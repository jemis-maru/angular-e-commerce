import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) {}

  isFormSubmitted: boolean = false;
  registrationFailed: boolean = false;

  registrationForm = new FormGroup({
    "name": new FormControl("", Validators.required),
    "email": new FormControl("", [Validators.required, this.emailValidator]),
    "password": new FormControl("", [Validators.required, Validators.minLength(6), this.passwordValidator]),
    "confirmPassword": new FormControl("", [Validators.required, Validators.minLength(6), this.passwordValidator]),
    "dob": new FormControl("", [Validators.required, this.dateValidator]),
  }, this.confirmPasswordValidator);

  emailValidator(control: FormControl): { isEmailValidate: boolean } | null {
    if(control.value != "" && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value))){
      return { isEmailValidate: false }
    }
    return null;
  }

  passwordValidator(control: FormControl): { isPasswordValid: boolean } | null {
    if(control.value != "" && !(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(control.value))){
      return { isPasswordValid: false }
    }
    return null;
  }

  dateValidator(control: FormControl): { isDateValidate: boolean } | null {
    if(new Date(control.value) > new Date()){
      return { isDateValidate: false }
    }
    return null;
  }

  confirmPasswordValidator(control: AbstractControl) {
    if(control.get('confirmPassword')?.value != "" && control.get('password')?.value != control.get('confirmPassword')?.value){
      return { isPassAndConfirmPassMatch: false }
    }
    return null;
  }

  onSubmit(): void {
    this.http.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseConfig.apiKey, {
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      returnSecureToken: true
    })
    .pipe(
      catchError(() => {
        this.registrationFailed = true;
        return of(false);
      })
    )
    .subscribe((response) => {
      if(response !== false){
        this.registrationFailed = false;
        this.http.post(environment.databaseUrl + "/users.json", {
          name: this.registrationForm.value.name,
          email: this.registrationForm.value.email,
          dob: this.registrationForm.value.dob,
          role: "user",
          isDisable: false
        })
        .subscribe((response) => {
          this.isFormSubmitted = true;
          this.router.navigate(['/login']);
        })
      }
    })
  }
}
