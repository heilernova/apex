import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { markAllDirty } from '../../utils';
import { AuthClient } from '../../services/auth';

@Component({
  selector: 'app-register-login',
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule
  ],
  templateUrl: './register-login.html',
  styleUrl: './register-login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterLogin {
 

}
