import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  userData = {};

  userSubject: Subject<any> = new Subject<any>();

  getUserData(){
    return this.userData;
  }

  setUserData(data: any): void{
    this.userData = data;
  }
}
