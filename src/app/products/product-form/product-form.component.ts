import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, UploadFile} from 'ng-zorro-antd';
import {Http} from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
    formModel: FormGroup;
    unit = '/';

    loading = false;
    avatarUrl: string;
    avatarPath: string;

    product: Product = new Product('', '', '', '', 0, '', ''); // 数据还没有回来之前给一个默认值
    isSave: Boolean = true;

    constructor(private msg: NzMessageService,
                public http: Http,
                public routeInfo: ActivatedRoute,
                public router: Router) {
    }

    ngOnInit() {
        const self = this;
        const fb = new FormBuilder();
        this.formModel = fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            price: ['', [Validators.required]],
            banner: ['', [Validators.required]],
            code: [0, [Validators.required]],
            unit: ['', [Validators.required]],
            desc: ['']
        });

        const id = this.routeInfo.snapshot.params['id'];
        this.getProduct(id).subscribe(
            res => {
                if (id != 0) {
                    self.isSave = false;
                    this.avatarUrl = (res.banner as any).path;
                    this.avatarPath = (res.banner as any)._id;
                }

                this.formModel.reset({
                    name: res.name,
                    price: res.price,
                    unit: res.unit,
                    code: res.code,
                    banner: res.banner,
                    desc: res.desc
                });
                this.product = res;
            }
        );
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
            desc: this.formModel.value.desc
        });
        if (this.formModel.valid && this.formModel.value.banner !== null) {
            const url = '/api/saveProduct';
            const self = this;
            this.http.post(url, this.formModel.value)
                .map(res => res.json())
                .subscribe(function (data) {
                    if (data.code === 0) {
                        self.router.navigateByUrl('/admin/products');
                    }
                });
        }
    }

    update(product: Product) {
        this.formModel.reset({
            banner: this.avatarPath,
            name: this.formModel.value.name,
            price: this.formModel.value.price,
            code: this.formModel.value.code,
            unit: this.formModel.value.unit,
            desc: this.formModel.value.desc
        });
        if (this.formModel.valid && this.formModel.value.banner !== null) {
            const url = '/api/updateProduct/' + product._id;
            const self = this;
            // const params = new URLSearchParams();
            // params.append('name', this.formModel.value.name);
            // params.append('price', this.formModel.value.price);
            // params.append('banner', this.formModel.value.banner);
            // params.append('code', this.formModel.value.code);

            this.http.post(url, this.formModel.value)
                .map(res => res.json())
                .subscribe(function (data) {
                    if (data.code === 0) {
                        self.router.navigateByUrl('/admin/products');
                    }
                });
        }
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get('/api/product/' + id).map(res => res.json());
    }

}

class Product {
    constructor(public _id: string,
                public banner: string,
                public name: string,
                public price: string,
                public code: number,
                public unit: string,
                public desc: string) {
    }
}

