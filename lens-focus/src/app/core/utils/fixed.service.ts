import { Injectable } from '@angular/core';
import { UserProfile } from '../model/user-profile.model';

@Injectable()
export class FixedService {

  public userProfile = new UserProfile();

  public sidebar:Boolean=false;
  public activeMode :'dark'|'light' = 'dark';

  constructor() {
  }

}
