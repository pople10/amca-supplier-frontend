import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerService } from 'src/app/services/buyer.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import {Location} from '@angular/common';
import { CommentService } from 'src/app/services/comment.service';
import { CommentResponse } from 'src/app/entities/CommentResponse';
import { StarRatingColor } from '../../../form-elements/star-rating/star-rating.component';
import { CommentRequest } from 'src/app/entities/CommentRequest';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from 'src/app/services/shared/file.service';
import { RateFields } from 'src/app/entities/enum/RateFields';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit,AfterViewInit {
  page=0;
  loading:boolean;
  data:any;
  id:number;
  currentComment:CommentResponse;
  comment:CommentRequest=new CommentRequest;
  starColor:StarRatingColor = StarRatingColor.accent;
  dataSent:boolean=false;
  currentComments:CommentResponse[];
  avg:number=0;
  doNotDisplay:string[]=["id","roles","comments","createDate","modifyDate"];
  scrollInto:string;
  thisYear:number=new Date().getFullYear();
  fields:string[]=RateFields;

  constructor(
    public fileService:FileService,
    private buyerService:BuyerService, 
    private route: ActivatedRoute,
    private handler:HandleRequestService,
    private router:Router,
    private translate:TranslateService,
    private _location: Location,
    public languageService:LanguageService,
    private snack:MatSnackBar,
    private commentService:CommentService) {
      this.id=parseInt(this.route.snapshot.paramMap.get('id'));
      this.loadData();
     }
  ngAfterViewInit(): void {
    if(this.scrollInto)
    {
      setTimeout(()=>{
        let el:HTMLElement=document.getElementById(this.scrollInto);
        if(el)
          el.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      },500);
    }
  }

  loadData()
  {
    this.loading=true;
    this.buyerService.getSupplierById(this.id).subscribe(response=>{
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
    this.commentService.getMyComment(this.id).subscribe(res=>{
      this.currentComment=res;
    });
    this.comment.supplier_id=this.id;
    
    if(this.router.getCurrentNavigation()?.extras?.state?.scroll)
    {
      this.scrollInto=this.router.getCurrentNavigation().extras.state?.scroll;
    }
  }

  ngOnInit(): void {
    if(!this.id)
      this.onError();
  }

  onError()
  {
    this.goBack();
  }

  goBack()
  {
    this._location.back();
  }

  onRatingChanged(rate,field)
  {
    this.comment[field]=rate;
  }

  addComment()
  {
    if(!this.comment.isValidFields()||!this.comment.comment)
    {
      this.snack.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    this.dataSent=true;
    this.commentService.addComment(this.comment).subscribe(()=>{
      this.loadData();
      Swal.fire(
        {
          position: 'center',
          title: this.translate.instant("success"),
          text: this.translate.instant("done"),
          showConfirmButton: false,
          icon: 'success',
          timer:2000
        }
      );
    },err=>{
      this.handler.handleError(err);
    }).add(()=>{this.dataSent=false});
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
