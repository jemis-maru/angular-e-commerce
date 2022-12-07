import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
    let user: any = this.authService.getUserData();
    this.userEmail = user.email;
    this.fetchCartData();
  }

  orderData: any = [];
  totalAmount: number = 0;
  userEmail: string = "";

  fetchCartData(): void {
    this.totalAmount = 0;
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
              imgUrl: data[id].imgUrl ? data[id].imgUrl : '',
            });
          }
        }
        return orderArr;
      }))
      .subscribe((response: any) => {
        this.orderData = response;
        this.orderData.forEach((element: any) => {
          this.totalAmount = this.totalAmount + (element.price * element.quantity);
        });
      })
  }

  cancelOrder(data: any): void {
    this.http.get<any>(environment.databaseUrl+`/products/${data.productId}.json`)
      .subscribe((res: any) => {
        this.http.patch<any>(environment.databaseUrl + `/products/${data.productId}.json`, {
          stock: res.stock + data.quantity
        })
          .subscribe((response: any) => {
            this.http.delete<any>(environment.databaseUrl + `/order/${data.id}.json`)
              .subscribe((response: any) => {
                this.fetchCartData();
              })
          })
      })
  }

  goToMyOrders(): void {
    this.router.navigate(['/my-orders']);
  }
}
