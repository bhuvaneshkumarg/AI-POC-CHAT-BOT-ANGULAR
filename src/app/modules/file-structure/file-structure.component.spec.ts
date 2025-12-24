import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStructureComponent } from './file-structure.component';

describe('FileStructureComponent', () => {
  let component: FileStructureComponent;
  let fixture: ComponentFixture<FileStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
