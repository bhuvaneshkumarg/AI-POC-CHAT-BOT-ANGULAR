import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionDashboardComponent } from './conversion-dashboard.component';

describe('ConversionDashboardComponent', () => {
  let component: ConversionDashboardComponent;
  let fixture: ComponentFixture<ConversionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversionDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
