import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {
    this.fetchCartData();
  }

  ngOnInit(): void {
  }

  cartData: any = [];
  isQuantityValid: boolean = true;
  totalAmount: number = 0;

  fetchCartData(): void {
    this.totalAmount = 0;
    this.http.get<any>(environment.databaseUrl + '/cart.json')
      .pipe(map((data: any) => {
        let productsArr = [];
        for (let id in data) {
          if (data[id].email === "jemismaru@gmail.com") {
            productsArr.push({
              id,
              productId: data[id].id,
              name: data[id].name,
              description: data[id].description,
              price: data[id].price,
              stock: data[id].stock,
              email: data[id].email,
              quantity: data[id].quantity,
              imgUrl: data[id].imgUrl ? data[id].imgUrl : '',
            });
          }
        }
        return productsArr;
      }))
      .subscribe((response: any) => {
        this.cartData = response;
        this.cartData.forEach((element: any) => {
          this.totalAmount = this.totalAmount + (element.price * element.quantity);
        });
      })
  }

  changeQuantity(event: any, id: string): void {
    let index = this.cartData.findIndex((data: any) => {
      return data.id === id;
    });

    if(index !== -1){
      this.cartData[index]['quantity'] = event.target.value;
    }
  }
  
  increaseQuantity(id: string): void {
    let index = this.cartData.findIndex((data: any) => {
      return data.id === id;
    });

    if(index !== -1){
      this.cartData[index]['quantity'] = this.cartData[index]['quantity'] + 1;
    }

    if(this.cartData[index]['quantity'] >= this.cartData[index]['stock']){
      this.cartData[index]['quantity'] = this.cartData[index]['stock'];
    }
  }
  
  decreaseQuantity(id: any): void {
    
    let index = this.cartData.findIndex((data: any) => {
      return data.id === id;
    });

    if(index !== -1){
      this.cartData[index]['quantity'] = this.cartData[index]['quantity'] - 1;
    }

    if(this.cartData[index]['quantity'] <= 0){
      this.cartData[index]['quantity'] = 0;
    }
  }

  editQuantity(id: any): void {
    let index = this.cartData.findIndex((data: any) => {
      return data.id === id;
    });

    if(index !== -1){
      if(this.cartData[index]['quantity'] <= 0 || this.cartData[index]['quantity'] >= this.cartData[index]['stock']){
        this.isQuantityValid = false;
      }
      else {
        this.isQuantityValid = true;
        this.http.patch<any>(environment.databaseUrl + `/cart/${id}.json`, this.cartData[index])
        .subscribe((response: any) => {
          console.log(response);
        })
      }
    }
  }

  removeFromCart(id: string): void {
    this.http.delete<any>(environment.databaseUrl + `/cart/${id}.json`)
      .subscribe((response: any) => {
        console.log(response);
        this.fetchCartData();
      })
  }

  placeOrder(): void {
    console.log(this.cartData);
    this.cartData.forEach((data: any) => {
      this.http.patch<any>(environment.databaseUrl + `/products/${data.productId}.json`, {
        stock: data.stock - data.quantity
      })
        .subscribe((response: any) => {
          this.http.post<any>(environment.databaseUrl+`/order.json`, {
            ...data,
            stock: data.stock - data.quantity,
            status: "order placed"
          }).subscribe((res: any) => {
            console.log(res);
            this.http.delete<any>(environment.databaseUrl+`/cart/${data.id}.json`)
              .subscribe((res: any) => {
                console.log(res);
                this.router.navigate(['/order-summary']);
              })
          })
        })
    });
  }
}
