import {  Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { AlertifyService } from 'src/app/services/shared/alertify.service';
import { MatDialog } from '@angular/material/dialog';
import {  PostResponse } from '../../../../entities/UnitPostResponse';
import { PostService } from '../../../../services/post.service';
import { HandleRequestService } from '../../../../services/shared/handle-request.service';

@Component({
  selector: 'app-forum-all',
  templateUrl: './forum-all.component.html',
  styleUrls: ['./forum-all.component.scss']
})
export class ForumAllComponent implements OnInit {
  @ViewChild('addMail') selectInput;
  opened:boolean=false;
  dataSent:boolean = false;
  isLoad:boolean = false;
  currentPost:PostResponse = new PostResponse();
  isSubmitted:boolean = false;
  index:number=0;
  postId: number;
  newComment:string='';
  disableComment:boolean=false;

  constructor(
    public languageService:LanguageService,
    private route: ActivatedRoute,
    private alertify:AlertifyService,
    private postService:PostService,
    private translate:TranslateService,
    private snackBar:MatSnackBar,
    private router:Router,
    private modalService:NgbModal,
    private authService:AuthService,
    private dialog: MatDialog,
    private handleRequestService:HandleRequestService
  ) { 
    this.route.paramMap.subscribe((params) => {
      this.postId = +params.get('id');
    });
    this.getData();
  }

  

  openDialog(dialogTemplate: any): void {
    this.dialog.open(dialogTemplate);
  }
  closeDialog(): void {
    if (this.dialog) {
      this.dialog.closeAll();
    }
    this.currentPost = new PostResponse();
  }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {

  }

 


  addComment(id){
    this.disableComment = true;
    this.postService.addCommentToPost(this.postId,{content:this.newComment}).subscribe(response=>{
      this.currentPost=response;
    },err=>{
        this.handleRequestService.handleErrorWithCallBack(err,()=>{
          this.router.navigate(["/error"]);
        });
    }).add(()=>{
      this.isLoad = true;
      this.newComment="";
      this.disableComment = false;
    });
  }

  private getData() {
      this.postService.getPost(this.postId).subscribe(response=>{
          this.currentPost=response;
      },err=>{
          
      }).add(()=>{
        this.isLoad = true;
      });
    }

    updatePost(e:PostResponse) {
      this.currentPost = e;
    }

    likePost(isLike){
      if(isLike){
        this.currentPost.count++;
        this.currentPost.liked=true;
      }
      else{
        this.currentPost.count--;
        this.currentPost.liked=false;
      }
      this.postService.likePost(this.postId,isLike).subscribe(response=>{
        // this.currentPost=response;
    },err=>{
        
    }).add(()=>{
    });
    }
}




