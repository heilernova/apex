import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { markAllDirty } from '../../utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthClient } from '../../services/auth';
import { AuthSession } from '../../auth';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  protected readonly _nzMessage = inject(NzMessageService);
  private readonly _authClient = inject(AuthClient);
  private readonly _router = inject(Router);
  private readonly _authSession = inject(AuthSession);
  protected readonly loading = signal(false);
  protected readonly formGroup = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  protected submit(): void {
    if (this.formGroup.invalid) {
      markAllDirty(this.formGroup);
      this._nzMessage.error('Por favor complete el formulario correctamente.');
      return;
    }

    const credentials = this.formGroup.getRawValue();
    this.formGroup.disable();
    this.loading.set(true);

    this._authClient.login(credentials).subscribe({
      next: (data) => {
        console.log('Login successful:', data);
        this._nzMessage.success('Inicio de sesión exitoso.');
        this._authSession.setData(data);
        this._router.navigateByUrl('/');
      },
      error: () => {
        this.formGroup.enable();
        this.loading.set(false);
      }
    });

    setTimeout(() => {
      this.formGroup.enable();
      this.loading.set(false);
    }, 5000);
    console.log('Submitting credentials:', credentials);
  }
}
