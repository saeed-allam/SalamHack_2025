import { Component } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CookieEnum } from '../../enums/cookie.enum';
import { FixedService } from '../../utils/fixed.service';

@Component({
  selector: 'app-full-layout',
  standalone: false,
  templateUrl: './full-layout.component.html',
  styleUrl: './full-layout.component.scss'
})
export class FullLayoutComponent {
constructor(private storage: StorageMap,private fixed:FixedService){
}
ngOnInit() {
  this.storage.get(CookieEnum.LensFocusUserProfile).subscribe((res: any) => {
      if (res != null) {
          this.fixed.userProfile = res;
      }
  });
}
}
