import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
    formModel: FormGroup;
    id: string = null;

    constructor(private fb: FormBuilder,
                private message: NzMessageService,
                private http: Http) {
    }

    ngOnInit() {
        this.formModel = this.fb.group({
            versionNumber: ['', [Validators.required]],
            iosUrl: ['https://itunes.apple.com/cn/app/id1296700807', [Validators.required]],
            androidUrl: ['https://fir.im/emzu', [Validators.required]],
            desc: ['', [Validators.required]]
        });

        this._getVersion();
    }

    _submitForm = ($event, value) => {
        $event.preventDefault();
        for (const key in this.formModel.controls) {
            if (this.formModel.controls.hasOwnProperty(key)) {
                this.formModel.controls[key].markAsDirty();
            }
        }
        if (this.formModel.valid) {
            this.http.post('/api/admin/save/version', value)
                .map(res => res.json())
                .subscribe(
                    json => {
                        if (json.code === 0) {
                            this.message.success('保存成功');
                        }
                    }
                );
        }
    }

    _getVersion() {
        this.http.get('/api/admin/get/version')
            .map(res => res.json())
            .subscribe(
                json => {
                    if (json.code === 0) {
                        if (json.data !== null) {
                            this.formModel.reset({
                                versionNumber: json.data.versionNumber,
                                iosUrl: json.data.iosUrl,
                                androidUrl: json.data.androidUrl,
                                desc: json.data.desc
                            });
                        }
                    }
                }
            );
    }

}
