import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Platform } from '@angular/cdk/platform';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { markAllDirty } from '../../utils';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AthleteCategory } from '@app/schemas/types';
import { NzInputNumber } from '../../form-components/nz-input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AccountClient } from '../../services/account';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzInputNumber,
    NzDatePickerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile {
  private readonly _account = inject(AccountClient);
  private readonly _nzMessage = inject(NzMessageService);
  private readonly _platform = inject(Platform);
  protected formGroup = formGroup();
  protected loading = signal<boolean>(true);

  constructor() {
    this.formGroup.disable();
    if (this._platform.isBrowser){
      this._account.getInfo().subscribe({
        next: res => {
          this.formGroup.setValue({
            alias: res.alias || '',
            birthdate: new Date(res.birthdate),
            category: res.category,
            nationality: res.nationality,
            height: res.height,
            weight: res.weight,
            firstName: res.firstName,
            lastName: res.lastName,
            gender: res.gender
          });
          this.formGroup.enable();
          this.loading.set(false);
        },
        error: () => {
          this.formGroup.disable();
        }
      })
    }
  }

  protected onSubmit(): void {
    if (this.formGroup.valid) {
      // Handle form submission
      console.log(this.formGroup.value);
    } else {
      // Mark all fields as dirty to show validation errors
      markAllDirty(this.formGroup);
    }
  }
}


const formGroup = () => new FormGroup({
  // email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  // username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  // cellphone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+57 \d{3} \d{3} \d{4}$/)] }),
  
  alias: new FormControl('', { nonNullable: true }),  
  firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

  nationality: new FormControl('CO', { nonNullable: true, validators: [Validators.required] }),
  
  height: new FormControl<number>(0, { validators: [Validators.required, Validators.min(30)] }),
  weight: new FormControl<number>(0, { validators: [Validators.required, Validators.min(10)] }),
  birthdate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
  gender: new FormControl<'M' | 'F' | null>(null, { nonNullable: true, validators: [Validators.required] }),
  category: new FormControl<AthleteCategory>('beginner', { nonNullable: true, validators: [Validators.required] }),
});