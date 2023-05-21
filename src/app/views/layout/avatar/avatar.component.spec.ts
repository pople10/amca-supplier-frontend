import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatMarComponent } from './avatar.component';

describe('AvatMarComponent', () => {
  let component: AvatMarComponent;
  let fixture: ComponentFixture<AvatMarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatMarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatMarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
