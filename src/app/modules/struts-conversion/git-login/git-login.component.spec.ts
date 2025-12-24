import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitLoginComponent } from './git-login.component';

describe('GitLoginComponent', () => {
  let component: GitLoginComponent;
  let fixture: ComponentFixture<GitLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
