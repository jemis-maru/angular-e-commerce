import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    let user: any = this.authService.getUserData();
    this.userEmail = user.email;
    this.fetchCartData();
  }

  orderData: any = [];
  userEmail: string = "";

  fetchCartData(): void {
    this.http.get<any>(environment.databaseUrl + '/order.json')
      .pipe(map((data: any) => {
        let orderArr = [];
        for (let id in data) {
          if (data[id].email === this.userEmail) {
            orderArr.push({
              id,
              productId: data[id].productId,
              name: data[id].name,
              description: data[id].description,
              price: data[id].price,
              email: data[id].email,
              quantity: data[id].quantity,
              status: data[id].status,
              imgUrl: data[id].imgUrl ? data[id].imgUrl : '',
            });
          }
        }
        return orderArr;
      }))
      .subscribe((response: any) => {
        this.orderData = response;
      })
  }
}
