import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StarRatingComponent implements OnInit {

  @Input('rating') public rating: number = 3;
  @Input('starCount') public starCount: number = 4;
  @Input('color') public color: string = 'accent';
  @Output() public ratingUpdated = new EventEmitter();

  public snackBarDuration: number = 2000;
  public ratingArr = [];

  constructor() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }


  ngOnInit() {
  }
  onClick(rating:number) {
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  
  getRateLabel(rate){
    if(rate==1)
      return "unsatisfied";
    if(rate==2)
      return "mean";
    if(rate==3)
      return "satisfied";
    if(rate==4)
      return "excellent";
    return "unknown";
  }

}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
