import { Component } from '@angular/core';
import { GetProductsService } from '../shared/service/get-products.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private productService: GetProductsService, private router: Router) { }

  products: [] = [];
  searchTxt: string = "";

  ngOnInit(): void {
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

  goToProductDetails(product: any): void {
    this.router.navigate(
      ['/product-detail'],
      { queryParams: { id: product.id } }
    );
  }
}

