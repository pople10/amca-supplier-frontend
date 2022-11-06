import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeArtistComponent } from './home-artist.component';

describe('HomeArtistComponent', () => {
  let component: HomeArtistComponent;
  let fixture: ComponentFixture<HomeArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeArtistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
