import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
    questions: any = [];
    isVisible = false;
    dealQuestion: any = null;
    dealId: string = null;

    formModel: FormGroup;
    isView = false;

    constructor(private router: Router,
                private fb: FormBuilder,
                private http: Http) {
    }

    ngOnInit() {
        this._getQuestions();
        this.formModel = this.fb.group({
            dealCate: [''],
            dealDesc: ['']
        });
    }

    create() {
        this.router.navigateByUrl('admin/questions-add');
    }

    _getQuestions() {
        this.http.get('/api/admin/questions-list')
            .map(res => res.json())
            .subscribe(
                json => {
                    if (json.code === 0) {
                        this.questions = json.data;
                    }
                }
            );
    }

    deal(question) {
        this.dealId = question._id;

        this.http.get('/api/admin/question/' + question._id)
            .map(res => res.json())
            .subscribe(
                json => {
                    if (json.code === 0) {
                        this.dealQuestion = json.data;
                        this.isVisible = true;
                    }
                }
            );
    }

    handleCancel($event) {
        this.isVisible = false;
    }

    handleOk($event) {
        if (!this.isView) {
            this.formModel.value.id = this.dealId;
            this.http.post('/api/admin/updateQuestion', this.formModel.value)
                .map(res => res.json())
                .subscribe(
                    json => {
                        if (json.code === 0) {
                            this.isVisible = false;
                            this._getQuestions();
                        }
                    }
                );
        } else {
            this.isVisible = false;
        }
    }

    showDeal(question) {
        const self = this;
        this.dealId = question._id;
        this.isView = true;
        this.http.get('/api/admin/question/' + question._id)
            .map(res => res.json())
            .subscribe(
                json => {
                    if (json.code === 0) {
                        this.dealQuestion = json.data;
                        self.formModel.reset({
                            dealCate: json.data.dealCate + '',
                            dealDesc: json.data.dealDesc
                        });
                        this.isVisible = true;
                    }
                }
            );
    }
}
