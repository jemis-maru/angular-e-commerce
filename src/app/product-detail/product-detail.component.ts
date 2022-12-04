import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GetProductsService } from '../shared/service/get-products.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, private getProducts: GetProductsService) {
    let id = activatedRoute.snapshot.queryParams['id'];
    if(id){
      this.getProducts.getAllProducts()
      .subscribe((response: any) => {
        let product = {...response[id], id: id};
        this.product = product;
      });
    }
    else{
      this.router.navigate(['/home']);
    }
  }

  product: any = {};
  quantity: number = 0;
  isQuantityValid = true;

  ngOnInit(): void {
  }
  
  increaseQuantity(): void {
    this.quantity++;
    if(this.quantity >= this.product.stock){
      this.quantity = this.product.stock;
    }
  }
  
  decreaseQuantity(): void {
    this.quantity--;
    if(this.quantity < 0){
      this.quantity = 0;
    }
  }

  addToCart(): void {
    if(this.quantity <= 0 || this.quantity >= this.product.stock){
      this.isQuantityValid = false;
    }
    else{
      this.http.post<any>(environment.databaseUrl+`/cart.json`, {
        ...this.product,
        email: "jemismaru123@gmail.com",
        quantity: this.quantity
      }).subscribe((res: any) => {
        console.log(res);
      })
    }
  }

}
