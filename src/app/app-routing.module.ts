import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrdersTabComponent } from './orders-tab/orders-tab.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductTabComponent } from './product-tab/product-tab.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersTabComponent } from './users-tab/users-tab.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-summary', component: OrderSummaryComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'add-product', component: AddProductComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'products', component: ProductTabComponent },
      { path: 'users', component: UsersTabComponent },
      { path: 'orders', component: OrdersTabComponent },
    ]
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
