import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NzInputNumber } from './nz-input-number.component';

describe('NzInputNumberComponent', () => {
  let component: NzInputNumber;
  let fixture: ComponentFixture<NzInputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NzInputNumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NzInputNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
