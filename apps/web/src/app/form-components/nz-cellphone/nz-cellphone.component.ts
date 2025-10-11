/* eslint-disable @typescript-eslint/no-explicit-any */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { Component, ElementRef, EventEmitter, inject, input, Input, OnInit, output, Output, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject } from 'rxjs';

@Component({
   // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nz-cellphone',
  imports: [
      IMaskModule,
      FormsModule,
      NzInputModule
  ],
  templateUrl: './nz-cellphone.component.html',
  styleUrl: './nz-cellphone.component.scss',
  host: {
    "class": "ant-input",
    '[class.ant-input-disabled]': 'disable',
    '[class.ant-input-number-focused]': 'isFocused',
    '[class.ant-input-status-error]': 'invalid()'
  }
})
export class NzCellphone implements OnInit, ControlValueAccessor {
  
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _focusMonitor = inject(FocusMonitor);
  
  private readonly _platform = inject(Platform);
  public mask: { mask: string; lazy: boolean } | undefined = undefined;
  private _value = "";
  isFocused = false;
  public disable = false;
  public stateChanges = new Subject<void>();
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};
  public empty = true;
  public readonly readOnly = input<boolean>(false);
  
  public readonly invalid = signal<boolean>(false);
  
  public ngControl: NgControl | null = inject(NgControl, { self: true, optional: true });

  @Output() valueChange = new EventEmitter<number>();

  constructor() {
    if (this.ngControl){
      this.ngControl.valueAccessor = this;
      const existingValidator = this.ngControl.control?.validator ? [this.ngControl.control.validator] : [];
      console.log(this.ngControl.control?.validator);
      this.ngControl.control?.setValidators([...existingValidator, phoneValidator]);
      this.ngControl.control?.updateValueAndValidity();
    }
  
    if (this._platform.isBrowser){
      this.mask = { 
        mask: "(000) 000-0000",  // enable number mask
        lazy: true,
      };
    }
  }  
  ngOnInit(): void {
    this.ngControl?.statusChanges?.subscribe(() => {
      const isInvalid = this.ngControl?.invalid && this.ngControl.dirty;
      this.invalid.set(isInvalid ?? false);
    })
  }


  // validate(control: AbstractControl): ValidationErrors | null {
  //   if (!control.value) return null;

  //   const errors: ValidationErrors = {};

  //   // Validación específica para teléfonos colombianos
  //   const phoneRegex = /^\+57 \d{3} \d{3} \d{4}$/;
  //   if (!phoneRegex.test(control.value)) {
  //     errors['invalidPhone'] = { 
  //       message: 'Debe ser un número de teléfono colombiano válido (+57 XXX XXX XXXX)',
  //       actualValue: control.value 
  //     };
  //   }
  //   const keys = Object.keys(errors);
  //   this.invalid.set(keys.length > 0 ? true : false);
  //   return keys.length ? errors : null;
  // }

  private _inputValue = '';
  public set inputValue(value: string){
    this._inputValue = value;
    this.value = value;
  }
  public get inputValue(){
    return this._inputValue;
  }

  @Input()
  get value(){
    return this._value;
  }

  set value(value: string){   
    const numbersOnly = value.replace(/\D/g, ''); // Extraer solo los números
    const formattedValue = numbersOnly.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'); // Formatear con espacios
    this._value = '+57 ' +  formattedValue.trim();
    this.onChange(this._value);

  }
  
  public writeValue(obj: any): void {
    if (typeof obj === "string" && /^\+\d+ \d{3} \d{3} \d{4}$/.test(obj)){
      this.value = obj.substring(3);
      this._inputValue = obj.substring(3);
      return;
    }
    
    this.value = "";
    this._inputValue = "";
    return;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }


  onFocus(): void {
    this.isFocused = true;
    this.focus.emit();
  }

  onBlur(): void {
    this.isFocused = false;
    this._elementRef.nativeElement.blur();
  }

  // eslint-disable-next-line @angular-eslint/no-output-native
  public focus = output<void>();
}


export const  phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;
  
  const phoneRegex = /^\+57 \d{3} \d{3} \d{4}$/;
  if (!phoneRegex.test(control.value)) {
    return {
      invalidPhone: {
        message: 'Debe ser un número de teléfono colombiano válido (+57 XXX XXX XXXX)',
        actualValue: control.value
      }
    };
  }
  return null;
};