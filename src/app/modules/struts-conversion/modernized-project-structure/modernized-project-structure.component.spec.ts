import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModernizedProjectStructureComponent } from './modernized-project-structure.component';

describe('ModernizedProjectStructureComponent', () => {
  let component: ModernizedProjectStructureComponent;
  let fixture: ComponentFixture<ModernizedProjectStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModernizedProjectStructureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModernizedProjectStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
