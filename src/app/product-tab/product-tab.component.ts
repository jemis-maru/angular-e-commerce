import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetProductsService } from '../shared/service/get-products.service';

@Component({
  selector: 'app-product-tab',
  templateUrl: './product-tab.component.html',
  styleUrls: ['./product-tab.component.scss']
})
export class ProductTabComponent {
  constructor(private productService: GetProductsService, private router: Router, private http: HttpClient) {
    this.fetchProducts();
  }
  
  products: any = [];

  fetchProducts(): void {
    this.productService.getAllProducts()
      .pipe(map((data: any) => {
        let productsArr = [];
        for (let id in data) {
          productsArr.push({
            id,
            name: data[id].name,
            description: data[id].description,
            price: data[id].price,
            stock: data[id].stock,
            imgUrl: data[id].imgUrl ? data[id].imgUrl : '',
          });
        }
        return productsArr;
      }))
      .subscribe((response: any) => {
        this.products = response;
      });
  }

  addProduct(): void {
    this.productService.setMode("create");
    this.router.navigate(['/add-product']);
  }

  editProduct(product: any): void {
    this.productService.setMode("edit");
    this.productService.setProduct(product);
    this.router.navigate(["/add-product"]);
  }

  deleteProduct(id: string): void {
    this.http
      .delete(`${environment.databaseUrl}/products/${id}.json`)
      .subscribe((responseData: any) => {
        this.fetchProducts();
      });
  }
}
