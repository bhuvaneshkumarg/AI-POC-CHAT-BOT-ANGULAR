import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceCodeConversionPageComponent } from './source-code-conversion-page.component';

describe('SourceCodeConversionPageComponent', () => {
  let component: SourceCodeConversionPageComponent;
  let fixture: ComponentFixture<SourceCodeConversionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceCodeConversionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceCodeConversionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
