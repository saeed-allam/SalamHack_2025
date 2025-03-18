import { Injectable } from '@angular/core';
import { UserProfile } from '../model/user-profile.model';
import { SystemConfigModel } from '../model/system-config.model';

@Injectable()
export class FixedService {

  public userProfile = new UserProfile();

  public allowAnonymous = ['token', 'Token/Refresh', 'User/Logout'];
  public sysConfig = new SystemConfigModel();
  public tokenRequestSent = false;

  public sidebar:Boolean=false;
  public activeMode :'dark'|'light' = 'dark';

  constructor() {
  }

}
