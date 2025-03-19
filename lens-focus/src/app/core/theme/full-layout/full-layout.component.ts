import { Component } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CookieEnum } from '../../enums/cookie.enum';
import { FixedService } from '../../utils/fixed.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-full-layout',
  standalone: false,
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.scss'
})
export class FullLayoutComponent {
constructor(private storage: StorageMap,private fixed:FixedService,
    private cookieSer: CookieService,){
}
ngOnInit() {
  this.storage.get(CookieEnum.LensFocusUserProfile).subscribe((res: any) => {
      if (res != null) {
          this.fixed.userProfile = res;
      }
  });
 this.fixed.youtubeCookies = this.cookieSer.get(CookieEnum.youtubeToken);
}
}
