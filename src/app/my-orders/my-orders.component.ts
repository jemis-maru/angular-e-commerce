import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent {
  constructor(private http: HttpClient, private router: Router) {
    this.fetchCartData();
  }

  orderData: any = [];

  fetchCartData(): void {
    this.http.get<any>(environment.databaseUrl + '/order.json')
      .pipe(map((data: any) => {
        let orderArr = [];
        for (let id in data) {
          if (data[id].email === "jemismaru@gmail.com") {
            orderArr.push({
              id,
              productId: data[id].productId,
              name: data[id].name,
              description: data[id].description,
              price: data[id].price,
              email: data[id].email,
              quantity: data[id].quantity,
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
