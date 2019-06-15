import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    product_sun: Number = 0;
    order_sun: Number = 0;
    order_today: Number = 0;
    order_status_1: Number = 0;
    user_sun: Number = 0;
    user_today: Number = 0;

    constructor(public http: HttpClient) {
    }

    ngOnInit() {
        this.getDashboardData().subscribe(
            res => {
                if (res['code'] === 0) {
                    this.product_sun = res['data']['product_sun'];
                    this.order_sun = res['data']['order_sun'];
                    this.order_today = res['data']['order_today'];
                    this.order_status_1 =  res['data']['order_status_1'];
                    this.user_sun = res['data']['user_sun'];
                    this.user_today = res['data']['user_today'];
                }
            }
        );
    }

    getDashboardData() {
        return this.http.get('/api/dashboard')
            // .map(res => res.json());
    }

}
