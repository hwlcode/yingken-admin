import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
    users: Array<string> = [];
    nzTotal: Number = 0;
    nzPageIndex: Number = 1;

    constructor(public http: HttpClient) {
    }

    ngOnInit() {
        this.getUsers(1).subscribe(res => {
            if (res['code'] === 0) {
                this.users = res['data'];
                this.nzTotal = res['total'];

                this.users.map(user => {
                    if ((user as any).avatar == null) {
                        (user as any).avatar = 'assets/user2-160x160.jpg';
                    } else {
                        (user as any).avatar = (user as any).avatar.path;
                    }
                });
            }
        });
    }

    getUsers(page) {
        return this.http.get('/api/users?q=' + page)
            // .map(res => res.json());
    }

    pageChange($event) {
        this.getUsers(this.nzPageIndex).subscribe(res => {
            if (res['code'] === 0) {
                this.users = res['data'];
                this.nzTotal = res['total'];

                this.users.map(user => {
                    if ((user as any).avatar == null) {
                        (user as any).avatar = 'assets/user2-160x160.jpg';
                    } else {
                        (user as any).avatar = (user as any).avatar.path;
                    }
                });
            }
        });
    }

}
