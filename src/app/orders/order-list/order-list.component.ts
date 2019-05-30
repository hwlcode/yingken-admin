import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
    public orderList: Array<string> = [];
    nzPageIndex: Number = 1;
    nzTotal: Number = 0;
    keywords: string = null;

    constructor(public http: Http, public router: Router) {
    }

    ngOnInit() {
        if (window.localStorage.getItem('order_page')) {
            this.nzPageIndex = parseInt(window.localStorage.getItem('order_page'), 10);
        }

        this.getOrderList(this.nzPageIndex).subscribe(data => {
            if (data.code === 0) {
                this.orderList = data.orders;
                this.nzTotal = data.total;
                this.orderList.map(order => {
                    (order as any).products = JSON.parse((order as any).products);
                });
            }
        });
    }

    getOrderList(page, search?) {
        return this.http.get('/api/order/list?q=' + page + (search === undefined ? '' : ('&keywords=' + search))).map(res => res.json());
    }

    pageChange($event) {
        this.getOrderList(this.nzPageIndex).subscribe(
            data => {
                if (data.code === 0) {
                    this.orderList = data.orders;
                    this.nzTotal = data.total;

                    this.orderList.map(order => {
                        (order as any).products = JSON.parse((order as any).products);
                    });
                }
            });

        if (!window.localStorage.getItem('order_page')) {
            window.localStorage.setItem('order_page', this.nzPageIndex + '');
        } else {
            window.localStorage.removeItem('order_page');
            window.localStorage.setItem('order_page', this.nzPageIndex + '');
        }

    }

    open(id) {
        this.router.navigateByUrl('/admin/order/' + id);
    }

    onSearch($event) {
        this.getOrderList(1, this.keywords).subscribe(
            json => {
                if (json.code === 0) {
                    this.orderList = json.orders;
                    this.nzTotal = json.total;
                    this.orderList.map(order => {
                        (order as any).products = JSON.parse((order as any).products);
                    });
                }
            }
        );
    }

}
