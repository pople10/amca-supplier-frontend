import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LanguageService } from 'src/app/services/language/language.service';
@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    public languageService:LanguageService,
    @Inject(MAT_DIALOG_DATA) public data:any
    ) 
  { 
      dialogRef.afterOpened().subscribe(()=>{
        
      })
  }

  clear()
  {
    this.data.callback();
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  getNavigation(type,id)
  {
    if(type=="MESSAGE_RECEIVED") return `/general/room/${id}`;
    if(type=="REQUEST_ADDED") return "/buyer/suppliers/requests/list";
    return "#";
  }

  getColor(type)
  {
    if(type=="MESSAGE_RECEIVED") return "#5E50F9";
    if(type=="REQUEST_ADDED") return "#727cf5";
    if(type=="REQUEST_APPROVED") return "green";
    return "black";
  }

  getIcon(type)
  {
    if(type=="MESSAGE_RECEIVED") return "message";
    if(type=="REQUEST_ADDED") return "business_center";
    if(type=="REQUEST_APPROVED") return "done_outline";
    return "notifications";
  }

}
