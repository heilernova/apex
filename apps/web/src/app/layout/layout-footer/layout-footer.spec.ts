import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutFooter } from './layout-footer';

describe('LayoutFooter', () => {
  let component: LayoutFooter;
  let fixture: ComponentFixture<LayoutFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
