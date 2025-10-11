import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Profile } from "../../components/profile/profile";
import { NzButtonComponent } from "ng-zorro-antd/button";
import { AccountSettings } from "../../components/account-settings/account-settings";

@Component({
  selector: 'app-profile-page',
  imports: [Profile, NzButtonComponent, AccountSettings],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {

}
