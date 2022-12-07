import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetProductsService {

  constructor(private httpClient: HttpClient) { }

  mode: string = "create";

  product: any = {};

  setProduct(product: any): void {
    this.product = product;
  }

  getProduct(): any {
    return this.product;
  }

  setMode(mode: string): void {
    this.mode = mode;
  }

  getMode(): string {
    return this.mode;
  }

  getAllProducts(): any{
    return this.httpClient.get<any>(environment.databaseUrl+`/products.json`);
  }
}
