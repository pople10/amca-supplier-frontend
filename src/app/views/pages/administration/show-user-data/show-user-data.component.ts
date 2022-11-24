import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'dialog-show-user-data',
  templateUrl: './show-user-data.component.html',
  styleUrls: ['./show-user-data.component.scss']
})
export class ShowUserDataComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ShowUserDataComponent>,
    public languageService:LanguageService,
    @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  whatIsIt(object) {
    var arrayConstructor = [].constructor;
    var objectConstructor = ({}).constructor;
    if(object==null||object==undefined)
      return "Other"
    if (object.constructor === arrayConstructor) {
        return "Array";
    }
    if (object.constructor === objectConstructor) {
        return "Object";
    }
    return "Other"
  }

  onPrint() {
    window.print();    
  }

  thisYear:number=new Date().getFullYear();

  getLength(obj):number
  {
    if(!obj) return 0;
    return Object.values(obj).length;
  }

  getArray(obj):any[]
  {
    if(!obj) return [];
    return Object.values(obj);
  }

}
