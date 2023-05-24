import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { RoomRequest } from 'src/app/entities/RoomRequest';
import { UserChatResponse } from 'src/app/entities/UserChatResponse';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/shared/file.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit,AfterViewInit {
  @ViewChild('addMail') selectInput;
  data:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=[];
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
  toBeAdd:string=null;
  request:RoomRequest=new RoomRequest();
  id:number;
  searchedUsers:UserChatResponse[]=[];
  dataSent:boolean=false;
  searching:boolean=false;
  label:string;
  isSupplier:boolean;

  constructor(
    public fileService:FileService,
    private modalService:NgbModal,
    private chatService:ChatService,
    private authService:AuthService,
    private handleRequestService:HandleRequestService,
    public languageService:LanguageService,
    private translate:TranslateService,
    private router:Router,
    private snackBar:MatSnackBar,
    private dialog: MatDialog
    ) 
    {
      this.isSupplier=this.authService.getUserDataLocalStorage().roles.includes("supplier");
    }
    openDialog(dialogTemplate: any): void {
      this.dialog.open(dialogTemplate);
      setTimeout(() => {
        if(this.isSupplier) return;
      const input = this.selectInput.element.children[0].children[0].children[1].children[0];
      input.addEventListener("keyup", (data)=>{
        let val = input?.value;
        if(val&&val.length>=3)
        {
          this.getUsers(val);
          return;
        }
        this.searchedUsers=[];
      });
      }, 700);
    }
    closeDialog(): void {
      if (this.dialog) {
        this.dialog.closeAll();
      }
    }
  getUsers(val)
  {
    this.searching=true;
        this.dataSent=true;
        this.chatService.getUsersByKeyword(val).subscribe(data=>{
          this.searchedUsers=data;
        },err=>{this.searchedUsers=[];})
        .add(()=>{this.dataSent=false;this.searching=false;})
  }

  ngAfterViewInit(): void {
    // if(this.isSupplier) return;
    // const input = this.selectInput.element.children[0].children[0].children[1].children[0];
    // input.addEventListener("keyup", (data)=>{
    //   let val = input?.value;
    //   if(val&&val.length>=3)
    //   {
    //     this.getUsers(val);
    //     return;
    //   }
    //   this.searchedUsers=[];
    // });
  }

  onAddEmail(e)
  {
    if(this.toBeAdd==null||this.toBeAdd=="")
    {
      this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    if(!this.request.emails.includes(this.toBeAdd))
    {
      this.request.emails.push(this.toBeAdd);
    }
    else
    {
      this.snackBar.open(this.translate.instant('alreadyEntered'), this.translate.instant('close'));
    }
    this.toBeAdd=null;
  }

    ngOnInit(): void {
      this.initData();
    }
  
    private initData()
    {
      this.getData(0);
    }

    deleteEmail(c,i)
    {
      this.modalService.open(c, {centered: true}).result.then((result) => {
        if(result == "save"){
          this.request.emails=this.request.emails.filter(e=>e!=i);
          Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
      }});
    }

    onChangeKeyword(e)
    {
      if(!e)
        this.searchedUsers=[];
    }

    geItem(id)
    {
      this.router.navigate([`/general/room/${id}`]);
    }
  
    private getData(page:number)
    {
      this.isLoad=true;
      this.chatService.getMyRooms(page,this.currentSize).subscribe(response=>{
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

    addRoom()
    {
      if(!this.request.emails||this.request.emails.length==0||!this.request.label||this.request.label=="")
      {
        this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
        return;
      }
      this.dataSent=true;
      this.chatService.addRoom(this.request).subscribe(
        res=>{
            this.id=null;
            if(this.data.pageDetails.numberOfElements<=1&&this.currentPage!=0)
              this.currentPage=this.currentPage-1;
            this.getData(this.currentPage);
            if(this.data.content.length==0&&this.currentPage!=0) 
            {
              this.getData(0);
            }
            this.request.emails=[];
            this.request.label=null;
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
    }
  
    deleteItem(componant,refToDelete,index){
      this.modalService.open(componant, {centered: true}).result.then((result) => {
        if(result == "save"){
        this.doingAction=true;
        this.doingActionTo=index;
        this.chatService.closeRoom(refToDelete)
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

}
