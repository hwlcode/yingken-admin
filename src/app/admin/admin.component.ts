import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    constructor(private router: Router, private http: Http) {
    }

    ngOnInit() {
    }

    loginOut() {
        const usr = window.sessionStorage.getItem('yk_login_usr');
        this.http.get('/api/admin/logout?usr=' + usr + '&token=' + window.sessionStorage.getItem('_token'))
            .map(res => res.json())
            .subscribe(json => {
                if (json.code === 0) {
                    window.sessionStorage.removeItem('yk_login_usr');
                    window.sessionStorage.removeItem('_token');

                    this.router.navigateByUrl('/login');
                }
            });
    }

}
