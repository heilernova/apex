import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-sign-up-form',
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpForm {
  protected readonly passwordType = signal<'text' | 'password'>('password');

  protected togglePasswordVisibility(hidden: boolean) {
    this.passwordType.set(hidden ? 'password' : 'text');
  }
}
