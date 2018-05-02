import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
    id: string;
    orders: any;
    customer: any;
    sn: string;
    sum: number;
    address: string;
    phone: string;
    name: string;
    hide: Boolean = false;

    isVisible = false;

    constructor(public http: Http,
                public router: Router,
                public routeInfo: ActivatedRoute) {
    }

    ngOnInit() {
        this.id = this.routeInfo.snapshot.params['id'];
        this.getOrderMsg().subscribe(
            res => {
                if (res.code === 0) {
                    this.orders = JSON.parse(res.data[0].products);
                    this.customer = res.data[0].customer;
                    this.address = this.customer.address;
                    this.name = this.customer.name;
                    this.phone = this.customer.phone;
                    this.sn = res.data[0].sn;
                    this.sum = res.data[0].sumPrice;
                    this.hide = res.data[0].type > 0 ? true : false;
                }
            }
        );
    }

    cannel() {
        this.router.navigate(['/admin/orders']);
    }

    getOrderMsg(): Observable<any> {
        return this.http.get('/api/order/' + this.id).map(res => res.json());
    }

    showModal = () => {
        this.isVisible = true;
    }

    handleOk = (e) => {
        this.http.get('/api/order/send/' + this.id).map(res => res.json()).subscribe(
            data => {
                if (data.code === 0) {
                    this.router.navigate(['/admin/orders']);
                }
            }
        )
        this.isVisible = false;
    }

    handleCancel = (e) => {
        this.isVisible = false;
    }

}
