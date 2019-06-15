import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    formModel: FormGroup;
    loading = false;
    avatarUrl: string;
    avatarPath: string;
    product: any;
    isSave: boolean = true;

    constructor(private msg: NzMessageService,
                public http: HttpClient,
                public routeInfo: ActivatedRoute,
                public router: Router) {
    }

    ngOnInit() {
        const self = this;
        const fb = new FormBuilder();
        this.formModel = fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            price: ['', [Validators.required]],
            origin_price: ['', [Validators.required]],
            origin_price_unit: ['', [Validators.required]],
            banner: ['', [Validators.required]],
            code: [0, [Validators.required]],
            unit: ['', [Validators.required]],
            desc: [''],
            pro_status: [0, [Validators.required]]
        });

        const id = this.routeInfo.snapshot.params['id'];
        if (id !== '0') {
            this.getProduct(id).subscribe(
                res => {
                    if (id !== '0') {
                        self.isSave = false;
                        this.avatarUrl = (res['banner'] as any).path;
                        this.avatarPath = (res['banner'] as any)._id;
                    }

                    this.formModel.reset({
                        name: res['name'],
                        price: res['price'],
                        unit: res['unit'],
                        code: res['code'],
                        banner: res['banner'],
                        desc: res['desc'],
                        origin_price: res['origin_price'],
                        origin_price_unit: res['origin_price_unit'],
                        pro_status: parseInt(res['pro_status'], 10)
                    });
                    this.product = res;
                }
            );
        }
    }

    updateOriginPrice(e) {
        this.formModel.patchValue({
            'origin_price_unit': e.target.value
        });
    }

    beforeUpload = (file: File) => {
        if (!(file.type === 'image/jpeg' || file.type === 'image/png')) {
            this.msg.error('只能上传JPG或PNG格式图片!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            this.msg.error('图片不能大于2M!');
            return false;
        }
    }

    private getBase64(img: File, callback: (img: any) => void) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChange(info: { file: UploadFile }) {
        if (info.file.status === 'uploading') {
            this.loading = true;
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, (img: any) => {
                this.loading = false;
                this.avatarPath = info.file.response.id;
                this.avatarUrl = img;
            });
        }
    }

    save() {
        this.formModel.reset({
            banner: this.avatarPath,
            name: this.formModel.value.name,
            price: this.formModel.value.price,
            code: this.formModel.value.code,
            unit: this.formModel.value.unit,
            desc: this.formModel.value.desc,
            origin_price: this.formModel.value.origin_price,
            origin_price_unit: this.formModel.value.origin_price_unit,
            pro_status: this.formModel.value.pro_status
        });
        if (this.formModel.valid && this.formModel.value.banner !== null) {
            const url = '/api/saveProduct';
            const self = this;
            this.http.post(url, this.formModel.value)
            // .map(res => res.json())
                .subscribe(function (data) {
                    if (data['code'] === 0) {
                        self.router.navigateByUrl('/admin/products');
                    }
                });
        }
    }

    update(product) {
        this.formModel.reset({
            banner: this.avatarPath,
            name: this.formModel.value.name,
            price: this.formModel.value.price,
            code: this.formModel.value.code,
            unit: this.formModel.value.unit,
            desc: this.formModel.value.desc,
            origin_price: this.formModel.value.origin_price,
            origin_price_unit: this.formModel.value.origin_price_unit,
            pro_status: this.formModel.value.pro_status
        });
        if (this.formModel.valid && this.formModel.value.banner !== null) {
            const url = '/api/updateProduct/' + product._id;
            const self = this;

            this.http.post(url, this.formModel.value)
            // .map(res => res.json())
                .subscribe(function (data) {
                    if (data['code'] === 0) {
                        self.router.navigateByUrl('/admin/products');
                    }
                });
        }
    }

    getProduct(id: string) {
        return this.http.get('/api/product/' + id)
        // .map(res => res.json());
    }

}
