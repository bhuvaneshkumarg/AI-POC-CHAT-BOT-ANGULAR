import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStandardizationComponent } from './file-standardization.component';

describe('FileStandardizationComponent', () => {
  let component: FileStandardizationComponent;
  let fixture: ComponentFixture<FileStandardizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileStandardizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileStandardizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
