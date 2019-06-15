import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import {Router} from '@angular/router';
import {Observable} from "rxjs/index";

@Component({
    selector: 'app-admin-list',
    templateUrl: './admin-list.component.html',
    styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
    users: any;
    delAdminId: string;

    isVisible = false;

    constructor(private http: HttpClient,
                private router: Router) {
    }

    ngOnInit() {
        this.getUserList().subscribe(res => {
            if (res.code === 0) {
                this.users = res.data.users;
            }
        });
    }

    getUserList(): Observable<any> {
        return this.http.get('/api/admin/admin-list')
            // .map(res => res.json());
    }

    create() {
        this.router.navigateByUrl('/admin/admin-add');
    }

    handleCancel($event) {
        this.isVisible = false;
    }

    handleOk($event) {
        this.isVisible = false;
        this.remove(this.delAdminId);
    }

    showModal = (user) => {
        this.isVisible = true;
        this.delAdminId = user;
    }

    remove(user) {
        this.http.get('/api/admin/delete/' + user._id)
            // .map(res => res.json())
            .subscribe(
                res => {
                    if (res['code'] === 0) {
                        this.users = res['data']['users'];
                    }
                }
            );
    }

    updatePassword(user) {
        this.router.navigateByUrl('admin/modify-password/' + user._id);
    }

}
