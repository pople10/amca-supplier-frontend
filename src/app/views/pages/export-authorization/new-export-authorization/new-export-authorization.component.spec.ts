import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExportAuthorizationComponent } from './new-export-authorization.component';

describe('NewExportAuthorizationComponent', () => {
  let component: NewExportAuthorizationComponent;
  let fixture: ComponentFixture<NewExportAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExportAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExportAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
