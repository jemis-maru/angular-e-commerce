import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders-tab',
  templateUrl: './orders-tab.component.html',
  styleUrls: ['./orders-tab.component.scss']
})
export class OrdersTabComponent {
  constructor(private http: HttpClient) {
    this.fetchOrders();
  }
  
  orders: any = [];

  fetchOrders(): void {
    this.http.get<any>(environment.databaseUrl + "/order.json")
      .pipe(map((data: any) => {
        let orderArr = [];
        for (let id in data) {
          orderArr.push({
            id,
            name: data[id].name,
            productId: data[id].productId,
            description: data[id].description,
            email: data[id].email,
            price: data[id].price,
            stock: data[id].stock,
            quantity: data[id].quantity,
            status: data[id].status,
            imgUrl: data[id].imgUrl ? data[id].imgUrl : '',
          });
        }
        return orderArr;
      }))
      .subscribe((response: any) => {
        this.orders = response;
      });
  }

  cancelOrder(order: any): void {
    this.http.get<any>(environment.databaseUrl+`/products/${order.productId}.json`)
      .subscribe((res: any) => {
        this.http.patch<any>(environment.databaseUrl + `/products/${order.productId}.json`, {
          stock: res.stock + order.quantity
        })
          .subscribe(() => {
            this.http.patch<any>(environment.databaseUrl + `/order/${order.id}.json`, {
              status: "cancelled"
            })
              .subscribe(() => {
                this.fetchOrders();
              })
          })
      })
  }
}
