import {  Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { AlertifyService } from 'src/app/services/shared/alertify.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { GenericPageable } from '../../../../entities/generic-pageable';
import { UnitPostResponse } from '../../../../entities/UnitPostResponse';
import { PostRequest } from '../../../../entities/PostRequest';
import { PostService } from '../../../../services/post.service';
import { HandleRequestService } from '../../../../services/shared/handle-request.service';
import { FileService } from 'src/app/services/shared/file.service';

@Component({
  selector: 'app-forum-user',
  templateUrl: './forum-user.component.html',
  styleUrls: ['./forum-user.component.scss']
})
export class ForumUserComponent implements OnInit {
  @ViewChild('addMail') selectInput;
  opened:boolean=false;
  posts:UnitPostResponse[];
  dataSent:boolean = false;
  isLoad:boolean = false;
  currentPage:number=0;
  currentSize:number=10;
  data:GenericPageable<UnitPostResponse>=new GenericPageable();
  fields:string[]=["id","title"]
  fieldsDates:string[]=["createDate"];
  currentPost:PostRequest = new PostRequest();
  isSubmitted:boolean = false;
  index:number=-1;
  doingAction:number=null;
  isAdmin = false;
  user:any={};
  isLoadMore:boolean = true;
  typeFetch:string = 'TIME'; 
  typesOfFetch = ['TIME','LIKE'];

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
        ['link']
      ],
    },
 }

  constructor(
    public languageService:LanguageService,
    private route: ActivatedRoute,
    private alertify:AlertifyService,
    private postService:PostService,
    private translate:TranslateService,
    private snackBar:MatSnackBar,
    private router:Router,
    public fileService:FileService,
    private modalService:NgbModal,
    private authService:AuthService,
    private dialog: MatDialog,
    private handleRequestService:HandleRequestService
  ) { 
    this.getData(false);
     try{
      this.user = JSON.parse(localStorage.getItem("userData"));
      if(this.user.roles.includes("admin")) this.isAdmin=true;
      }
      catch(e){}
  }
  removeHtmlTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }
  openDialog(dialogTemplate: any): void {
    this.dialog.open(dialogTemplate);
  }
  closeDialog(): void {
    if (this.dialog) {
      this.dialog.closeAll();
    }
    this.dataSent = false;
    this.currentPost = new PostRequest();
    this.index = -1;
    this.isSubmitted = false;
  }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {

  }

 

  addPost(){
    this.isSubmitted=true;
    if(this.currentPost.content==null ||this.currentPost.content?.length==0 ||this.currentPost.title.length==0 ){
      return;
    }
    this.dataSent = true;
    if(!this.currentPost.id)
      this.postService.createPost(this.currentPost).subscribe(response=>{
            this.posts=[response,...this.posts];
            this.data.content=this.posts;
            this.closeDialog();
        },err=>{ 
          this.dataSent = false;
          });
    else  this.postService.updatePost(this.currentPost).subscribe(response=>{
            this.posts[this.index]=response;
            this.data.content=this.posts;
            this.closeDialog();
        },err=>{ 
          this.dataSent = false;
          });
    
  }
  

  

  private getData(isMore)
    {
      if(!isMore) this.isLoad=false;
      else this.isLoadMore = false;

      this.postService.getPosts(this.currentPage,this.currentSize,this.typeFetch).subscribe(response=>{
          this.data=response;
          if(isMore){
            this.posts=[...this.posts, ...this.data.content];
          }
          else{
            this.posts=this.data.content;
          }
      },err=>{
          this.handleRequestService.handleErrorWithCallBack(err,()=>{
            this.router.navigate(["/error"]);
          });
      }).add(()=>{
        this.currentPage++;
        this.isLoad=true;
        this.isLoadMore = true;
      });
    }

    loadMore()
    {
      this.getData(true);
    }
    
    checkContent (){
      return this.isSubmitted && (this.currentPost.content==null ||this.currentPost.content?.length==0 );
    }

    
    deletePost(c,i)
    {
      this.modalService.open(c, {centered: true}).result.then((result) => {
        if(result == "save"){
          this.doingAction=i;
          this.postService.deletePost(i).subscribe(response=>{
            this.posts=this.posts.filter(e=>e.id!=i);
            this.data.content= this.posts;
            this.doingAction=null;
            Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
        },err=>{ 
          this.doingAction=null;
          });
        }});
    }

    checkIfIsMe(post:UnitPostResponse){
      return this.isAdmin || this.user.email==post.creator?.email;
    }

    
    editPost(d,post,index){
      this.index=index;
      this.currentPost = post;
      this.openDialog(d)
    }
    
    navigateToPost(id){
      this.router.navigate(['/forum/post/'+id]);
    }

    likePost(id,isLike){
      var p = this.posts.filter(e=>e.id==id)[0];
      if(isLike){
        p.count++;
        p.liked=true;
      }
      else{
       p.count--;
        p.liked=false;
      }
      this.postService.likePost(id,isLike).subscribe(response=>{
        // this.currentPost=response;
    },err=>{
        
    }).add(()=>{
    });
    }
    changeType(){
     this.currentPage = 0;
     this.getData(false);
    }
}

