import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
    public orderList: Array<string> = [];
    nzPageIndex: Number = 1;
    nzTotal: Number = 0;

    constructor(public http: Http) {
    }

    ngOnInit() {
        this.getOrderList(1).subscribe(data => {
            if (data.code === 0) {
                this.orderList = data.orders;
                this.nzTotal = data.total;
                this.orderList.map(order => {
                    (order as any).products = JSON.parse((order as any).products);
                });
            }
        });
    }

    getOrderList(page) {
        return this.http.get('/api/order/list?q=' + page).map(res => res.json());
    }

    pageChange($even) {
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
    }

}
