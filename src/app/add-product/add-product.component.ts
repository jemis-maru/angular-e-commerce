import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { GetProductsService } from '../shared/service/get-products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  constructor(private fireStorage: AngularFireStorage, private http: HttpClient, private productService: GetProductsService) {
    this.mode = this.productService.getMode();

    if(this.mode === "edit"){
      this.productData = this.productService.getProduct();
      this.addProductForm.value.name = this.productData.name;
      this.addProductForm.value.description = this.productData.description;
      this.addProductForm.value.price = this.productData.price;
      this.addProductForm.value.stock = this.productData.stock;
      this.addProductForm = new FormGroup({
        "name": new FormControl(this.productData.name, Validators.required),
        "description": new FormControl(this.productData.description, Validators.required),
        "price": new FormControl(this.productData.price, Validators.required),
        "stock": new FormControl(this.productData.stock, Validators.required),
      });
      this.btnName = "Edit Product";
    }
  }

  addProductForm = new FormGroup({
    "name": new FormControl("", Validators.required),
    "description": new FormControl("", Validators.required),
    "price": new FormControl("", Validators.required),
    "stock": new FormControl("", Validators.required),
  });

  productImg: any = null;
  isFormSubmitted: boolean = false;
  task!: AngularFireUploadTask;
  mode: string = "create";
  productData: any = {};
  btnName: string = "Add Product";
  submittedMessage: string = "Product added successfully";

  changeProductImage(event: any): void {
    this.productImg = event.target.files[0];
  }

  async storeProductToDatabase(params: any) {
    if(this.mode === "edit"){
      this.http.patch<any>(environment.databaseUrl + `/products/${this.productData.id}.json`, params)
        .subscribe((response: any) => {
          this.submittedMessage = "Product edited successfully";
          this.isFormSubmitted = true;
        })
    }
    else{
      this.http
        .post(`${environment.databaseUrl}/products.json`, params)
        .subscribe((responseData: any) => {
          console.log(responseData);
          this.submittedMessage = "Product added successfully";
          this.isFormSubmitted = true;
        });
    }
  }

  async addProduct() {
    if (this.productImg) {
      const filePath = `products/${Date.now()}-${this.productImg.name}`;
      this.task = this.fireStorage.upload(filePath, this.productImg);
      (await this.task).ref.getDownloadURL().then(url => {
        let formObj = this.addProductForm.value;
        let params = { ...formObj, imgUrl: url }
        this.storeProductToDatabase(params);
      });
    } else {
      this.storeProductToDatabase(this.addProductForm.value);
    }
  }

}
