import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin-form',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.css']
})
export class AdminFormComponent implements OnInit {
    formModel: FormGroup;

    constructor(private fb: FormBuilder,
                private router: Router,
                private http: Http) {
    }

    ngOnInit() {
        this.formModel = this.fb.group({
            phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            checkPassword: ['', [Validators.required, Validators.minLength(6), this.confirmationValidator]]
        });
    }

    _submitForm() {
        this.formModel.value.password = Md5.hashStr(this.formModel.value.password).toString();
        this.formModel.value.checkPassword = Md5.hashStr(this.formModel.value.checkPassword).toString();

        if (this.formModel.valid) {
            const url = '/api/admin/saveAdmin';
            const self = this;
            this.http.post(url, this.formModel.value)
                .map(res => res.json())
                .subscribe(function (data) {
                    if (data.code === 0) {
                        self.router.navigateByUrl('/admin/admin-list');
                    }
                });
        }
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {required: true};
        } else if (control.value !== this.formModel.controls['password'].value) {
            return {confirm: true, error: true};
        }
    }

    updateConfirmValidator() {
        /** wait for refresh value */
        setTimeout(_ => {
            this.formModel.controls['checkPassword'].updateValueAndValidity();
        });
    }

}
