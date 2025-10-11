/* eslint-disable @typescript-eslint/no-empty-function */
import { AfterViewChecked, Component, effect, ElementRef, EventEmitter, forwardRef, inject, input, Input, OnInit, Output, signal } from '@angular/core';
import { AbstractControlDirective, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IMaskModule } from 'angular-imask';
import { Subject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nz-input-number',
  standalone: true,
  imports: [
    IMaskModule,
    FormsModule,
    NzInputModule
  ],
  templateUrl: './nz-input-number.component.html',
  styleUrl: './nz-input-number.component.scss',
  providers: [],
  host: {
    "class": "ant-input",
    '[class.ant-input-number-focused]': 'isFocused',
    '[class.ant-input-disabled]': 'disable',
    '[class.ant-input-status-error]': 'invalid()'
  }
})
export class NzInputNumber implements ControlValueAccessor, OnInit {
  private readonly _elementRef = inject(ElementRef<HTMLElement>);
  private readonly _focusMonitor = inject(FocusMonitor);

  private readonly _platform = inject(Platform);
  public mask: Record<string, unknown> | undefined = undefined;
  private _value = 0;
  isFocused = false;
  public disable = false;
  public stateChanges = new Subject<void>();
  public ngControl: NgControl | null = inject(NgControl, { optional: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (_: number) => {};
  public onTouched = () => {};
  public empty = true;
  public decimals = input<number>(0);
  public type = input<"number" | "percentage">("number");
  public readonly readOnly = input<boolean>(false);
  @Output() valueChange = new EventEmitter<number>();

  public readonly invalid = signal<boolean>(false);

  constructor(){
    if (this.ngControl){
      this.ngControl.valueAccessor = this;
    }
    
    if (this._platform.isBrowser){
      
      this.mask = { 
        mask: Number,  // enable number mask
        // other options are optional with defaults below
        scale: 0,  // digits after point, 0 for integers
        thousandsSeparator: '.',  // any single char
        padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
        normalizeZeros: true,  // appends or removes zeros at ends
        //radix: ',',  // fractional delimiter
        mapToRadix: ['.'],  // symbols to process as radix
        autofix: true,
      };
    }


    effect(() => {
      const decimals = this.decimals();
      if (this._platform.isBrowser) {
        this.mask = { 
          mask: Number,  // enable number mask
          // other options are optional with defaults below
          scale: decimals,  // digits after point, 0 for integers
          thousandsSeparator: '.',  // any single char
          padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
          normalizeZeros: true,  // appends or removes zeros at ends
          //radix: ',',  // fractional delimiter
          mapToRadix: ['.'],  // symbols to process as radix
          autofix: true,
        };
      }
    })
  }

  ngOnInit(): void {
     this.ngControl?.statusChanges?.subscribe(() => {
      const isInvalid = this.ngControl?.invalid && this.ngControl.dirty;
      this.invalid.set(isInvalid ?? false);
    });
  }


  private _inputValue = '0'
  public set inputValue(value: string){
    // const temp: string = value;
    this._inputValue = value;
    this.value = Number.parseFloat(value.replaceAll(".", "").replace(",", "."));
  }
  public get inputValue(){
    return this._inputValue;
  }

  @Input()
  get value(){
    return this._value;
  }

  set value(value: number){
    // this._value = value;
    if (this.type() == "percentage") {
      this.onChange(value / 100);
    } else {
      this.onChange(value);
    }
    // this.onChange(value);
  }
  
  public writeValue(obj: number | string): void {
    if (typeof obj == "number"){
      this.value = obj;
      this._inputValue = obj.toString().replace(".", ",");
    } else {
      this.value = 0;
      this._inputValue = "";
    }
  }
  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }


  focus(): void {
    this.isFocused = true;
    if (this._inputValue == '0'){
      this._inputValue = '';
    }
  }

  blur(): void {
    this.isFocused = false;
    this._elementRef.nativeElement.blur();
    if (this._inputValue == ''){
      this._inputValue = '0';
    }
  }
}
