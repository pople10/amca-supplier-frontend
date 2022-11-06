import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePrizeComponent } from './home-prize.component';

describe('HomePrizeComponent', () => {
  let component: HomePrizeComponent;
  let fixture: ComponentFixture<HomePrizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePrizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
