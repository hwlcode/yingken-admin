import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { Code404Component } from './code404/code404.component';
import {ReactiveFormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { HomeComponent } from './home/home.component';
import {HttpModule} from '@angular/http';
import { ProductFormComponent } from './products/product-form/product-form.component';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent, children: [
        {path: 'dashboard', component: HomeComponent},
        {path: 'products', component: ProductListComponent},
        {path: 'orders', component: OrderListComponent},
        {path: 'users', component: UserListComponent},
        {path: 'product/:id', component: ProductFormComponent},
    ]},
    {path: '**', component: Code404Component}
]

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AdminComponent,
        Code404Component,
        DashboardComponent,
        ProductListComponent,
        OrderListComponent,
        UserListComponent,
        HomeComponent,
        ProductFormComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        NgZorroAntdModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
