import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ResponseEnum } from 'src/app/core/enums/response.enum';
import { FixedService } from 'src/app/core/utils/fixed.service';
import { GlobalService } from 'src/app/core/utils/global.service';
import Swal from 'sweetalert2';

@Injectable()
export class BaseService {
  list: any = [];
  requestSent = false;
  id: string;
  url: string;
  listPage: string;
  operationPage: string;

  constructor(public global: GlobalService, public http: HttpClient, public fixed: FixedService, public router: Router) {}

  getById(id): Observable<any> {
    if (id == null) id = '';
    return this.http.get(this.url + 'GetById/' + id);
  }

  operation(model): Observable<any> {
    return model[this.id] == null ? this.http.post(this.url + 'Insert', model) : this.http.put(this.url + 'Edit', model);
  }

  delete(id): Observable<any> {
    return this.http.delete(this.url + 'Delete/' + id);
  }

  search(model): Observable<any> {
    return this.http.post(this.url + 'Search', model);
  }

  searchByTerm(term, includeIds?, otherParams?): Observable<any> {
    term = term == null ? '' : term;
    includeIds = includeIds == null ? '' : includeIds;
    otherParams = otherParams == null ? '' : otherParams;
    return this.http.get(this.url + 'SearchByTerm?term=' + term + '&includeIds=' + includeIds + otherParams);
  }

  getAll() {
    if (!this.requestSent) {
      this.requestSent = true;
      this.list = [];
      this.http.get(this.url + 'GetAll').subscribe({
        next: (response: any) => {
          this.list = response;
          this.requestSent = false;
        },
        error: err => {
          this.global.notificationMessage(ResponseEnum.Failed, null, null, err);
          this.requestSent = false;
        },
      });
    }
  }

  reload() {
    this.requestSent = false;
    this.list = [];
    this.getAll();
  }
}
