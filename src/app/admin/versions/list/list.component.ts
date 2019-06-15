import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    versions: any = [];

    constructor(private router: Router,
                private http: HttpClient) {
    }

    ngOnInit() {
        this.getVersions();
    }

    create() {
        this.router.navigateByUrl('/admin/app-versions-add');
    }

    getVersions() {
        this.http.get('/api/admin/versions')
            // .map(res => res.json())
            .subscribe(
                json => {
                    if (json['code'] === 0) {
                        this.versions = json['data'];
                    }
                }
            );
    }

    del(version) {
        this.http.get('/api/admin/del/version/' + version._id)
            // .map(res => res.json())
            .subscribe(
                json => {
                    if (json['code'] === 0) {
                        this.versions = json['data'];
                    }
                }
            );
    }

}
