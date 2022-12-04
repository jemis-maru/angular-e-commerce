import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  constructor(private fireStorage: AngularFireStorage, private http: HttpClient) { }

  addProductForm = new FormGroup({
    "name": new FormControl("", Validators.required),
    "description": new FormControl("", Validators.required),
    "price": new FormControl("", Validators.required),
    "stock": new FormControl("", Validators.required),
  });

  productImg: any = null;
  isFormSubmitted: boolean = false;
  task!: AngularFireUploadTask;

  changeProductImage(event: any): void {
    this.productImg = event.target.files[0];
  }

  async storeProductToDatabase(params: any) {
    this.http
      .post(`${environment.databaseUrl}/products.json`, params)
      .subscribe((responseData: any) => {
        console.log(responseData);
        this.isFormSubmitted = true;
      });
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
