import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-admin-password',
    templateUrl: './admin-password.component.html',
    styleUrls: ['./admin-password.component.css']
})
export class AdminPasswordComponent implements OnInit {
    validateForm: FormGroup;
    show: Boolean = false;
    id: string;
    user: any;
    password: string;

    constructor(private fb: FormBuilder,
                private routerInfo: ActivatedRoute,
                private router: Router,
                private http: HttpClient) {
    }

    ngOnInit() {
        this.id = this.routerInfo.snapshot.params['id'];
        this.http.get('/api/admin/get_admin_user/' + this.id)
            // .map(res => res.json())
            .subscribe(json => {
                if (json['code'] === 0) {
                    this.user = json['data'][0];
                    this.password = json['data'][0].password;
                    this.validateForm.reset({
                        phone: this.user.phone
                    });
                }
            });

        this.validateForm = this.fb.group({
            phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
            password: ['', [Validators.required, Validators.minLength(6), this.checkOldPassword]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            checkNewPassword: ['', [Validators.required, Validators.minLength(6), this.confirmationValidator]]
        });
    }

    _submitForm() {
        this.validateForm.value.password = Md5.hashStr(this.validateForm.value.password).toString();
        this.validateForm.value.newPassword = Md5.hashStr(this.validateForm.value.newPassword).toString();
        this.validateForm.value.checkNewPassword = Md5.hashStr(this.validateForm.value.checkNewPassword).toString();

        if (this.validateForm.valid) {
            const url = '/api/admin/update_password/';
            const self = this;
            this.validateForm.value.id = this.id;
            this.http.post(url, this.validateForm.value)
                // .map(res => res.json())
                .subscribe(function (data) {
                    if (data['code'] === 0) {
                        self.router.navigateByUrl('/admin/admin-list');
                    }
                });
        }
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {required: true};
        } else if (control.value !== this.validateForm.controls['newPassword'].value) {
            return {confirm: true, error: true};
        }
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.validateForm.controls['checkNewPassword'].updateValueAndValidity();
        });
    }

    checkOldPassword = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {required: true};
        } else if (Md5.hashStr(control.value).toString() !== this.password) {
            return {confirm: true, error: true};
        }
    }
}
