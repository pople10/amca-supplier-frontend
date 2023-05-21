import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatMarComponent implements OnInit {
  @Input() src: string;
  @Input() short: string;
  @Input() name: string;
  constructor() { }

  ngOnInit(): void {
  }

}
