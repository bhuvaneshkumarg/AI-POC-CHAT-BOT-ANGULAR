import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionDashboardV1Component } from './conversion-dashboard-v1.component';

describe('ConversionDashboardV1Component', () => {
  let component: ConversionDashboardV1Component;
  let fixture: ComponentFixture<ConversionDashboardV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversionDashboardV1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionDashboardV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
