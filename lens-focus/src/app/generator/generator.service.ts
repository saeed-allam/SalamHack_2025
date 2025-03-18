import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class GeneratorService {

  constructor(private http:HttpClient) { }

  youtubeAuth(): Observable<any> {
    return this.http.get('api/auth/googleLogin');
  }
}
