import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AthleteCategory } from '@app/schemas/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { GeoData, IGeoCountry, IGeoCountryDivision } from '../../services/geo';
import { CommonModule } from '@angular/common';
import { NzCellphone } from '../../form-components/nz-cellphone';
import { NzInputNumber } from '../../form-components/nz-input-number';
import { GeoDataSource } from '../../services/geo/geo-data-source';
import { markAllDirty } from '../../utils';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-register-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule,
    NzCellphone,
    NzInputNumber
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPage {
  private _nzMessage = inject(NzMessageService);
  private _geoDataSource = inject(GeoDataSource);

  protected formGroup = formGroup();

  protected nationalityOptions = signal<IGeoCountry[]>([]);

  protected countriesOptions = signal<IGeoCountry[]>([]);
  protected statesOptions = signal<IGeoCountryDivision[]>([]);
  protected citiesOptions = signal<IGeoCountryDivision[]>([]);

  constructor() {
    this._geoDataSource.getCountries().then(countries => {
      this.nationalityOptions.set(countries);
      const country = countries.find(c => c.code === 'CO');
      if (country){
        this._geoDataSource.loadCountryData(country)
        .then(country => {
          this.countriesOptions.set([country]);
          if (country.data?.levels[0]) {
            this.statesOptions.set(country.data.divisions.filter(d => d.levelId === country.data?.levels[0].id));
            const res  = country.data.divisions.find(d => d.code === '95');
            if (res) {
              this.formGroup.controls.state.setValue(res.id);
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
      }
    });

    this.formGroup.controls.state.valueChanges.subscribe(stateId => {
      const country = this.nationalityOptions().find(c => c.code === 'CO');
      this.formGroup.controls.city.setValue('');
      if (country && country.data) {
        const state = country.data.divisions.filter(d => d.parentId === stateId);
        if (state) {
          this.citiesOptions.set(state);
        } else {
          this.citiesOptions.set([]);
        }
      }
        
    });
  }


  protected submitForm() {
    const values = this.formGroup.getRawValue();
    console.log(values);
    if (this.formGroup.invalid) {
      markAllDirty(this.formGroup);
      this._nzMessage.warning('Por favor completa correctamente el formulario');
      return;
    }


  }
  
}


const formGroup = () => new FormGroup({
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  cellphone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\+57 \d{3} \d{3} \d{4}$/)] }),
  
  alias: new FormControl('', { nonNullable: true }),  
  firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

  nationality: new FormControl('CO', { nonNullable: true, validators: [Validators.required] }),
  country: new FormControl('CO', { nonNullable: true, validators: [Validators.required] }),
  state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

  height: new FormControl<number>(0, { validators: [Validators.required, Validators.min(30)] }),
  weight: new FormControl<number>(0, { validators: [Validators.required, Validators.min(10)] }),
  birthdate: new FormControl<Date | null>(null, { validators: [Validators.required] }),
  gender: new FormControl<'M' | 'F' | null>(null, { nonNullable: true, validators: [Validators.required] }),
  category: new FormControl<AthleteCategory>('beginner', { nonNullable: true, validators: [Validators.required] }),

  password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(50)] }),
  confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), Validators.maxLength(50)] }),

});