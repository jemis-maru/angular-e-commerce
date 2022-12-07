import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.userData = userService.getUser();

    this.editUserForm = new FormGroup({
      "name": new FormControl(this.userData.name, Validators.required),
      "role": new FormControl(this.userData.role, Validators.required),
      "dob": new FormControl(this.userData.dob, [Validators.required, this.dateValidator]),
    });

    if(!this.userData.id){
      this.router.navigate(['/dashboard/users'])
    }

  }

  isFormSubmitted: boolean = false;
  userData: any = {};

  editUserForm = new FormGroup({
    "name": new FormControl("", Validators.required),
    "role": new FormControl("", Validators.required),
    "dob": new FormControl("", [Validators.required, this.dateValidator]),
  });

  dateValidator(control: FormControl): { isDateValidate: boolean } | null {
    if(new Date(control.value) > new Date()){
      return { isDateValidate: false }
    }
    return null;
  }

  onSubmit(): void {
    if(this.userData.id){
      this.http.patch<any>(environment.databaseUrl + `/users/${this.userData.id}.json`, this.editUserForm.value)
        .subscribe(() => {
          this.isFormSubmitted = true;
        })
    }
  }
}
