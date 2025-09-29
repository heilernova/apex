import { FormGroup } from '@angular/forms';

export const markAllDirty = (formGroup: FormGroup) => {
  Object.values(formGroup.controls).forEach(control => {
    if (control instanceof FormGroup) {
      markAllDirty(control);
    } else {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  });
};
