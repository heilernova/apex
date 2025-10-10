import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzCellphone } from './nz-cellphone.component';

describe('NzCellphoneComponent', () => {
  let component: NzCellphone;
  let fixture: ComponentFixture<NzCellphone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzCellphone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NzCellphone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
