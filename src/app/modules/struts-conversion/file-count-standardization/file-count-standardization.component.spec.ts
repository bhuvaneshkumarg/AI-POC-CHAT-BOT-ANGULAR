import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCountStandardizationComponent } from './file-count-standardization.component';

describe('FileCountStandardizationComponent', () => {
  let component: FileCountStandardizationComponent;
  let fixture: ComponentFixture<FileCountStandardizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileCountStandardizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileCountStandardizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
