import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stats-element',
  templateUrl: './stats-element.component.html',
  styleUrls: ['./stats-element.component.scss']
})
export class StatsElementComponent implements OnInit {
  @Input("icon") icon:string;
  @Input("label") label:string;
  @Input("value") value:number;
  @Input("color") color:string;

  constructor() { }

  ngOnInit(): void {
  }

}
