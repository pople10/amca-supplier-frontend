
import { Component, Input } from '@angular/core';
import { PostCommentResponse, PostResponse } from '../../../entities/UnitPostResponse';
import { LanguageService } from '../../../services/language/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { HandleRequestService } from '../../../services/shared/handle-request.service';
import { FileService } from 'src/app/services/shared/file.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent  {
  @Input() comment: PostCommentResponse; 
  @Input() onDone: (data: any) => void;

  showReplies: boolean = false;
  newReply: string = '';
  showReplyForm:boolean = false;
  disableReply:boolean = false;
  user:any = JSON.parse(localStorage.getItem("userData"));

  constructor(
    public languageService:LanguageService,
    private route: ActivatedRoute,
    public fileService:FileService,
    private postService:PostService,
    private router:Router,
    private handleRequestService:HandleRequestService
  ) {}

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }

  addReply(id) {
    this.disableReply = true;
    this.postService.addReplyToComment(this.comment.id,{content:this.newReply}).subscribe((response:PostResponse)=>{
      this.onDone(response);
      this.comment = response.comments.filter(e=>e.id==this.comment.id)[0];
    },err=>{
        this.handleRequestService.handleErrorWithCallBack(err,()=>{
          this.router.navigate(["/error"]);
        });
    }).add(()=>{
      this.disableReply = false;
      this.newReply='';
      this.showReplyForm = false;
    });
  }

  isMe(email){
    return this.user.email==email;
  }
  likeReply(id,isLike){
    let r = this.comment.replies.filter(e=>e.id==id)[0];
    if(isLike){
      r.count++;
      r.liked=true;
    }
    else{
      r.count--;
      r.liked=false;
    }
    this.postService.likeReply(id,isLike).subscribe((response:PostResponse)=>{
      this.onDone(response);
      this.comment.replies = response.comments.filter(e=>e.id==this.comment.id)[0].replies;
    },err=>{
        this.handleRequestService.handleErrorWithCallBack(err,()=>{
          this.router.navigate(["/error"]);
        });
    }).add(()=>{
      this.disableReply = false;
      this.newReply='';
      this.showReplyForm = false;
    });
  }
  likeComment(id,isLike){
    if(isLike){
      this.comment.count++;
      this.comment.liked=true;
    }
    else{
      this.comment.count--;
      this.comment.liked=false;
    }
    this.postService.likeComment(id,isLike).subscribe((response:PostResponse)=>{
      this.onDone(response);
      this.comment = response.comments.filter(e=>e.id==this.comment.id)[0];
    },err=>{
        this.handleRequestService.handleErrorWithCallBack(err,()=>{
          this.router.navigate(["/error"]);
        });
    }).add(()=>{
      this.disableReply = false;
      this.newReply='';
      this.showReplyForm = false;
    });
  }
  deleteComment(id){
    this.postService.deleteComment(id).subscribe((response)=>{
      this.comment.replies = this.comment.replies.filter(e=>e.id!=id);
    },err=>{
        
    }).add(()=>{
    });
  }

  deleteReply(id){
    this.postService.deleteReply(id).subscribe((response)=>{
      this.comment.replies = this.comment.replies.filter(e=>e.id!=id);
    },err=>{
        
    }).add(()=>{
    });
  }
}

