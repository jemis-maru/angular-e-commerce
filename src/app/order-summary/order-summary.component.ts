import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {
  constructor(private http: HttpClient, private router: Router) {
    this.fetchCartData();
  }

  orderData: any = [];
  totalAmount: number = 0;

  fetchCartData(): void {
    this.totalAmount = 0;
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
        this.orderData.forEach((element: any) => {
          this.totalAmount = this.totalAmount + (element.price * element.quantity);
        });
      })
  }

  cancelOrder(data: any): void {
    console.log(data);
    this.http.get<any>(environment.databaseUrl+`/products/${data.productId}.json`)
      .subscribe((res: any) => {
        console.log(res);
        this.http.patch<any>(environment.databaseUrl + `/products/${data.productId}.json`, {
          stock: res.stock + data.quantity
        })
          .subscribe((response: any) => {
            console.log(response);
            this.http.delete<any>(environment.databaseUrl + `/order/${data.id}.json`)
              .subscribe((response: any) => {
                console.log(response);
                this.fetchCartData();
              })
          })
      })
  }

  goToMyOrders(): void {
    this.router.navigate(['/my-orders']);
  }
}
