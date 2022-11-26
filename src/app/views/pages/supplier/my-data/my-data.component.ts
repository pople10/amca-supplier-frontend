import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import {Location} from '@angular/common';
import { CommentResponse } from 'src/app/entities/CommentResponse';
import { StarRatingColor } from '../../form-elements/star-rating/star-rating.component';
@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss']
})
export class MyDataComponent implements OnInit {
  loading:boolean;
  data:any;
  starColor:StarRatingColor = StarRatingColor.accent;
  dataSent:boolean=false;
  currentComments:CommentResponse[];
  avg:number=0;
  doNotDisplay:string[]=["id","roles","comments","createDate","modifyDate"];
  scrollInto:string;
  thisYear:number=new Date().getFullYear();

  constructor(
    private supplierService:SupplierService, 
    private route: ActivatedRoute,
    private handler:HandleRequestService,
    private router:Router,
    private _location: Location,
    public languageService:LanguageService) {
      this.loadData();
    }

  loadData()
  {
    this.loading=true;
    this.supplierService.getMyData().subscribe(response=>{
      this.data=response;
      this.currentComments=this.data?.comments;
      for(let s of this.doNotDisplay)
      {
        delete this.data[s];
      }
      if(this.currentComments)
        this.avg=this.currentComments.reduce((a,b)=>{return a+b.rate;},0)/(this.currentComments.length?this.currentComments.length:1);
    }
    ,  err=>{
      this.handler.handleError(err);
      this.onError();
    }
    ).add(()=>{this.loading=false;});
    
    if(this.router.getCurrentNavigation()?.extras?.state?.scroll)
    {
      this.scrollInto=this.router.getCurrentNavigation().extras.state?.scroll;
    }
  }

  ngOnInit(): void {
    
  }

  onError()
  {
    this.goBack();
  }

  goBack()
  {
    this._location.back();
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

getLength(obj):number
{
  return Object.values(obj).length;
}

getArray(obj):any[]
{
  return Object.values(obj);
}

}
