import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileContentDialogComponent } from './file-content-dialog.component';

describe('FileContentDialogComponent', () => {
  let component: FileContentDialogComponent;
  let fixture: ComponentFixture<FileContentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileContentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileContentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
