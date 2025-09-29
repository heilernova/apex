import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { GeoCity, GeoCountry, GeoData, GeoState } from '../../services/geo';
import { CommonModule } from '@angular/common';

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
    NzDatePickerModule
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPage {
  private _geoData = inject(GeoData);

  protected formGroup = formGroup();

  protected nationalityOptions = signal<GeoCountry[]>([]);

  protected countriesOptions = signal<GeoCountry[]>([]);
  protected statesOptions = signal<GeoState[]>([]);
  protected citiesOptions = signal<GeoCity[]>([]);

  constructor() {
    this._geoData.getCountries().then(countries => {
      this.nationalityOptions.set(countries);
      const country = countries.find(c => c.code === 'CO');
      if (country){
        this.countriesOptions.set([country]);
      }
      this._geoData.getStates('CO').then(states => {
        this.statesOptions.set(states);
      });
    });

    this.formGroup.controls.country.valueChanges.subscribe(countryCode => {
      this._geoData.getStates(countryCode).then(states => {
        this.statesOptions.set(states);
        this.citiesOptions.set([]);
      });
    });

    this.formGroup.controls.state.valueChanges.subscribe(stateId => {
      const state = this.statesOptions().find(s => s.id === stateId);
      if (state) {
        this.citiesOptions.set(state.cities);
      } else {
        this.citiesOptions.set([]);
      }
    });
  }
  
}


const formGroup = () => new FormGroup({
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  cellphone: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  
  firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),

  nationality: new FormControl('CO', { nonNullable: true, validators: [Validators.required] }),
  country: new FormControl('CO', { nonNullable: true, validators: [Validators.required] }),
  state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
});