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
import { AdminAuthCanActiveGuard } from './shared/guards/admin-auth-can-active.guard';
import { AuthCanActiveGuard } from './shared/guards/auth-can-active.guard';
import { NoAuthCanActiveGuard } from './shared/guards/no-auth-can-active.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersTabComponent } from './users-tab/users-tab.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthCanActiveGuard] },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthCanActiveGuard] },
  { path: 'order-summary', component: OrderSummaryComponent, canActivate: [AuthCanActiveGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthCanActiveGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthCanActiveGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AdminAuthCanActiveGuard] },
  {
    path: 'dashboard',
    canActivate: [AdminAuthCanActiveGuard],
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
