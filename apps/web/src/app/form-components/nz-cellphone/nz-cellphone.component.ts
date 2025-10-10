/* eslint-disable @typescript-eslint/no-explicit-any */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { Component, ElementRef, EventEmitter, forwardRef, inject, input, Input, output, Output } from '@angular/core';
import { AbstractControlDirective, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
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
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NzCellphone), multi: true }],
  host: {
    "class": "ant-input",
    '[class.ant-input-disabled]': 'disable',
    '[class.ant-input-number-focused]': 'isFocused'
  }
})
export class NzCellphone {
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _focusMonitor = inject(FocusMonitor);
  
  private readonly _platform = inject(Platform);
  public mask: { mask: string; lazy: boolean } | undefined = undefined;
  private _value = "";
  isFocused = false;
  public disable = false;
  public stateChanges = new Subject<void>();
  public ngControl: NgControl | AbstractControlDirective | null = null;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};
  public empty = true;
  public readonly readOnly = input<boolean>(false);

  @Output() valueChange = new EventEmitter<number>();

  // 

  constructor(){
    if (this._platform.isBrowser){
      this.mask = { 
        mask: "(000) 000-0000",  // enable number mask
        lazy: true,
      };
    }
  }  

  private _inputValue = '';
  public set inputValue(value: string){
    // const temp: string = value;
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
