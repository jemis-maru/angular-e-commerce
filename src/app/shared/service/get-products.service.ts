import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetProductsService {

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): any{
    return this.httpClient.get<any>(environment.databaseUrl+`/products.json`);
  }
}
