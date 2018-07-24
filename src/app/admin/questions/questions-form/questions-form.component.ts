import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Http} from '@angular/http';
import {Router} from '@angular/router';

@Component({
    selector: 'app-questions-form',
    templateUrl: './questions-form.component.html',
    styleUrls: ['./questions-form.component.css']
})
export class QuestionsFormComponent implements OnInit {
    formModel: FormGroup;

    fileList: any = [];
    previewImage = '';
    previewVisible = false;

    constructor(private fb: FormBuilder,
                private http: Http,
                private router: Router,
                private msg: NzMessageService) {
    }

    ngOnInit() {
        this.formModel = this.fb.group({
            cate: ['', [Validators.required]],
            title: ['', [Validators.required]],
            desc: ['', [Validators.required]],
            files: this.fb.array([])
        });
    }

    _submitForm($event) {
        $event.stopPropagation();

        for (const i in this.formModel.controls) {
            if (this.formModel.controls.hasOwnProperty(i)) {
                this.formModel.controls[i].markAsDirty();
            }
        }

        // 主要用于初始化files为空的FormArray
        this.formModel = this.fb.group({
            cate: [this.formModel.value.cate, [Validators.required]],
            title: [this.formModel.value.title, [Validators.required]],
            desc: [this.formModel.value.desc, [Validators.required]],
            files: this.fb.array([])
        });
        const arr = this.formModel.get('files') as FormArray;
        for (const f of this.fileList) {
            arr.push(new FormControl(f.response.id));
        }

        if (this.formModel.valid) {
            this.http.post('/api/admin/saveQuestion', this.formModel.value)
                .map(res => res.json())
                .subscribe(
                    json => {
                        if (json.code === 0) {
                            this.router.navigateByUrl('/admin/questions');
                        }
                    }
                );
        }
    }

    beforeUpload = (file: File) => {
        const isJPEG = file.type === 'image/jpeg';
        const isJPG = file.type === 'image/jpg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        if (!(isJPEG || isJPG || isPNG || isGIF)) {
            this.msg.error('只能上传jpg,png,gif图片格式的文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.msg.error('文件大小不能超过2MB!');
        }
        return (isJPEG || isJPG || isPNG || isGIF) && isLt2M;
    }

    // 预览图片
    handlePreview = (file: UploadFile) => {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
    }
}
