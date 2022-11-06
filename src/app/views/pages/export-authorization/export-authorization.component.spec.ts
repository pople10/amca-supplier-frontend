import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportAuthorizationComponent } from './export-authorization.component';

describe('ExportAuthorizationComponent', () => {
  let component: ExportAuthorizationComponent;
  let fixture: ComponentFixture<ExportAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
