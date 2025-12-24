import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionHomeComponent } from './conversion-home.component';

describe('ConversionHomeComponent', () => {
  let component: ConversionHomeComponent;
  let fixture: ComponentFixture<ConversionHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversionHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
