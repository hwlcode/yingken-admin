import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {Routes, RouterModule} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { Code404Component } from './code404/code404.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { HomeComponent } from './home/home.component';
import {HttpModule} from '@angular/http';
import { ProductFormComponent } from './products/product-form/product-form.component';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
import { AdminFormComponent } from './admin/admin-form/admin-form.component';
import { AdminPasswordComponent } from './admin/admin-password/admin-password.component';
import {AuthGuard} from './auth.guard';
import { QuestionsComponent } from './admin/questions/questions.component';
import { QuestionsFormComponent } from './admin/questions/questions-form/questions-form.component';
import { ListComponent } from './admin/versions/list/list.component';
import { FormComponent } from './admin/versions/form/form.component';

const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'admin', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'admin', component: AdminComponent, canActivateChild: [AuthGuard], children: [
        {path: 'dashboard', component: HomeComponent},
        {path: 'products', component: ProductListComponent},
        {path: 'orders', component: OrderListComponent},
        {path: 'order/:id', component: OrderDetailComponent},
        {path: 'users', component: UserListComponent},
        {path: 'product/:id', component: ProductFormComponent},
        {path: 'password', component: AdminListComponent},
        {path: 'admin-list', component: AdminListComponent},
        {path: 'admin-add', component: AdminFormComponent},
        {path: 'questions', component: QuestionsComponent},
        {path: 'questions-add', component: QuestionsFormComponent},
        {path: 'app-versions', component: FormComponent},
        {path: 'modify-password/:id', component: AdminPasswordComponent}
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
        ProductFormComponent,
        OrderDetailComponent,
        AdminListComponent,
        AdminFormComponent,
        AdminPasswordComponent,
        QuestionsComponent,
        QuestionsFormComponent,
        ListComponent,
        FormComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes),
        NgZorroAntdModule.forRoot()
    ],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy}, AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {
}
