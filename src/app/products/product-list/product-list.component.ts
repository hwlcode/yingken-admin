import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products: Array<string> = [];

    nzTotal: Number = 0;
    nzPageIndex: Number = 1;

    isVisible = false;

    delProduct: any;

    constructor(
        public http: HttpClient,
        public router: Router
    ) {
    }

    ngOnInit() {
        this.getProducts(1).subscribe(res => {
            if (res['code'] === 0) {
                this.products = res['data'];
                this.nzTotal = res['total'];
            }
        });
    }

    getProducts(page) {
        return this.http.get('/api/productList?q=' + page)
            // .map(res => res.json());
    }

    update(product) {
        this.router.navigateByUrl('/admin/product/' + product._id);
    }

    remove(product) {
        this.http.get('/api/delete/' + product._id)
            // .map(res => res.json())
            .subscribe(
                res => {
                    if (res['code'] === 0) {
                        this.products = res['data'];
                    }
                }
            );
    }

    create() {
        this.router.navigateByUrl('/admin/product/0');
    }

    pageChange($event) {
        this.getProducts(this.nzPageIndex).subscribe(res => {
            if (res['code'] === 0) {
                this.products = res['data'];
                this.nzTotal = res['total'];
            }
        });
    }

    showModal = (product) => {
        this.isVisible = true;
        this.delProduct = product;
    }

    handleOk = (e) => {
        this.isVisible = false;
        this.remove(this.delProduct);
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

}
