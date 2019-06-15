import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Md5} from 'ts-md5';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    validateForm: FormGroup;
    errMsg: String = '';
    hidden: Boolean = true;

    constructor(private fb: FormBuilder,
                private http: HttpClient,
                private router: Router) {
    }

    ngOnInit() {
        this.validateForm = this.fb.group({
            userName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    _submitForm() {
        this.validateForm.value.password = Md5.hashStr(this.validateForm.value.password).toString();

        if (this.validateForm.valid) {
            this.http.post('/api/admin/login', this.validateForm.value)
                // .map(res => res.json())
                .subscribe(json => {
                    if (json['code'] === 0) {
                        this.router.navigateByUrl('/admin/dashboard');
                        this.hidden = true;
                        this.errMsg = '';
                        if (window.sessionStorage && window.sessionStorage.getItem('yk_login_usr')) {
                            window.sessionStorage.removeItem('yk_login_usr');
                            window.sessionStorage.setItem('_token', json['token']);
                            window.sessionStorage.setItem('yk_login_usr', this.validateForm.value.userName);
                        } else {
                            window.sessionStorage.setItem('_token', json['token']);
                            window.sessionStorage.setItem('yk_login_usr', this.validateForm.value.userName);
                        }
                    } else {
                        this.hidden = false;
                        this.errMsg = json['msg'];
                    }
                });
        }
    }
}
