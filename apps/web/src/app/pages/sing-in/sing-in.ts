import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { LayoutFooter } from '../../layout/layout-footer/layout-footer';

@Component({
  selector: 'app-sing-in',
  imports: [
    RouterLink,
    LayoutFooter,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingIn {
  protected readonly passwordType = signal<'text' | 'password'>('password');

  protected togglePasswordVisibility(hidden: boolean) {
    this.passwordType.set(hidden ? 'password' : 'text');
  }
}
