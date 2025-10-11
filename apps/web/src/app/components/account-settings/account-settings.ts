import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCellphone } from '../../form-components/nz-cellphone';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountDataSource } from '../../services/account';

@Component({
  selector: 'app-account-settings',
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzCellphone
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSettings {
  private readonly _accountDataSource = inject(AccountDataSource);
  protected formGroup = new FormGroup({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email]}),
    cellphone: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+57 \d{3} \d{3} \d{4}$/)]}),
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]{3,16}$/)] })
  });

  constructor() {
    this.formGroup.disable();

    this._accountDataSource.getInfo().then(res => {
      this.formGroup.enable();
      this.formGroup.setValue({
        email: res.email,
        cellphone: res.cellphone,
        username: res.username
      })
    })
  }
}
