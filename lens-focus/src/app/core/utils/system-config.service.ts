import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SystemConfigModel } from '../model/system-config.model';


@Injectable()
export class SystemConfigService {
  private sysConfig: SystemConfigModel;

  constructor(private http: HttpClient) {}

  public getSystemConfig(): SystemConfigModel {
    return this.sysConfig;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.http.get('./system-config.json').subscribe({
        next: (response: SystemConfigModel) => {
          if (response != null) {
            this.sysConfig = response;
            console.log(response);
          }
          resolve(true);
        },
        error: error => {},
      });
    });
  }
}
