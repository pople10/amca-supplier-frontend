import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommentRequest } from 'src/app/entities/CommentRequest';
import { CommentResponse } from 'src/app/entities/CommentResponse';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { CommentService } from 'src/app/services/comment.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { StarRatingColor } from '../../../form-elements/star-rating/star-rating.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  data:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=[]
  /* Static columns 
  TODO translate status exist in StatusEnum [Backend] */
  fieldsStatic:string[]=[];
  fieldsDates:string[]=[];
  sizes:number[]=[5,10,20,50,100];
  isLoad:boolean=true;
  doingAction:boolean=false;
  doingActionTo:number=null;
  currentPage:number=0;
  currentSize:number=10;
  comment:CommentRequest=new CommentRequest();
  id:number;
  dataSent:boolean=false;
  starColor:StarRatingColor = StarRatingColor.accent;

  constructor(
    private modalService:NgbModal,
    private commentService:CommentService,
    private handleRequestService:HandleRequestService,
    public languageService:LanguageService,
    private translate:TranslateService,
    private router:Router
    ) 
    {

    }

    onRatingChanged(rate)
    {
      this.comment.rate=rate;
    }

    ngOnInit(): void {
      this.initData();
    }
  
    private initData()
    {
      this.getData(0);
    }
  
    private getData(page:number)
    {
      this.isLoad=true;
      this.commentService.getMyComments(page,this.currentSize).subscribe(response=>{
          this.data=response;
      },err=>{
          this.handleRequestService.handleErrorWithCallBack(err,()=>{
            this.router.navigate(["/error"]);
          });
      }).add(()=>{
        this.currentPage=page;
        this.isLoad=false;
      });
    }

    modifyComment()
    {
      this.dataSent=true;
      this.commentService.updateComment(this.id,this.comment).subscribe(
        res=>{
            this.id=null;
            if(this.data.pageDetails.numberOfElements<=1&&this.currentPage!=0)
              this.currentPage=this.currentPage-1;
            this.getData(this.currentPage);
            if(this.data.content.length==0&&this.currentPage!=0) 
            {
              this.getData(0);
            }
            Swal.fire( { position: 'center', title: this.translate.instant("done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
        },err=>{
          this.handleRequestService.handleError(err);
        }
      ).add(()=>{this.dataSent=false});
    }
  
    onChangePage(page)
    {
      this.getData(page-1);
    }
  
    updateItem(refToUpdate,index)
    {
      this.doingAction=true;
      this.doingActionTo=index;
      this.commentService.getCommentById(refToUpdate).subscribe((res)=>{
        this.comment=this.fromResponseToRequest(res);
        this.id=refToUpdate;
      },err=>{this.handleRequestService.handleError(err);})
      .add(()=>{this.doingAction=false;this.doingActionTo=null;});
    }

    fromResponseToRequest(res:CommentResponse):CommentRequest
    {
      let tmp:CommentRequest=new CommentRequest();
      tmp.comment=res.comment;
      tmp.supplier_id=res.supplier.id
      tmp.rate=res.rate;
      return tmp;
    }
  
    deleteItem(componant,refToDelete,index){
      this.modalService.open(componant, {centered: true}).result.then((result) => {
        if(result == "save"){
        this.doingAction=true;
        this.doingActionTo=index;
        this.commentService.deleteCommentById(refToDelete)
        .subscribe(e=>{
          if(this.data.pageDetails.numberOfElements<=1&&this.currentPage!=0)
            this.currentPage=this.currentPage-1;
          this.getData(this.currentPage);
          if(this.data.content.length==0&&this.currentPage!=0) 
          {
            this.getData(0);
          }
          Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
        },
        error=>{ this.handleRequestService.handleError(error)})
        .add(()=>{this.doingAction=false;this.doingActionTo=null;})
      }});
    }
  
    onChangeSize(data)
    {
      this.currentSize=data.target.value;
      this.getData(0);
    }

    view(id)
    {
      console.log(id);
      this.router.navigate([`/buyer/suppliers/${id}`],{ state: { scroll: 'yr' } });
    }

}
