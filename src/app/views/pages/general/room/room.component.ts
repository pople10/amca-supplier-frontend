import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { WebSocketSubject } from 'rxjs/webSocket';
import { RoomMessageResponse } from 'src/app/entities/RoomMessageResponse';
import { RoomRequest } from 'src/app/entities/RoomRequest';
import { RoomResponse } from 'src/app/entities/RoomResponse';
import { UserChatResponse } from 'src/app/entities/UserChatResponse';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { AlertifyService } from 'src/app/services/shared/alertify.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from 'src/app/services/shared/file.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('addMail') selectInput;
  msg:string=null;
  id:number;
  showParticipients:boolean=false;
  participients:UserChatResponse[]=[];
  data:RoomResponse=new RoomResponse();
  websocket:any;
  messages:RoomMessageResponse[]=[];
  toBeAdd:string=null;
  request:RoomRequest=new RoomRequest();
  searchedUsers:UserChatResponse[]=[];
  dataSent:boolean=false;
  searching:boolean=false;
  opened:boolean=false;
  myEmail:string=null;

  constructor(
    public fileService:FileService,
    private chatService:ChatService,
    private handleRequestService:HandleRequestService,
    public languageService:LanguageService,
    private route: ActivatedRoute,
    private alertify:AlertifyService,
    private translate:TranslateService,
    private snackBar:MatSnackBar,
    private router:Router,
    private modalService:NgbModal,
    private authService:AuthService,
    private dialog: MatDialog
  ) { 
    this.id=parseInt(this.route.snapshot.paramMap.get('id'));
    this.myEmail=this.authService.getEmailLocalStorage();
    this.chatService.getRoom(this.id).subscribe(data=>{
      this.participients=data.participants;
      this.data=data;
    },err=>{
      this.handleRequestService.handleError(err);
      this.router.navigate(["/general/rooms"]);
    })
  }
  openDialog(dialogTemplate: any): void {
    this.dialog.open(dialogTemplate);
    setTimeout(() => {
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
    }, 500);
  }
  closeDialog(): void {
    if (this.dialog) {
      this.dialog.closeAll();
    }
  }
  ngOnDestroy(): void {
    this.websocket.close();
  }

  ngOnInit(): void {
    this.websocket=this.chatService.getRoomWebSocket(this.id);
    this.websocket.addEventListener('open', (event) => {
      
    });

    this.websocket.addEventListener("error",(event)=>{
      this.alertify.error(event?.data?event.data:this.translate.instant("internalError"));
    })
    
    // Listen for messages
    this.websocket.addEventListener('message', (event) => {
        let received = JSON.parse(event.data);
        if(this.whatIsIt(received)=="Array")
        {
          this.messages=received;
        }
        else if(this.whatIsIt(received)=="Object")
        {
          this.playSound("/assets/sound/notification.mp3",received)
          this.messages.push(received);
        }
        else
        {

        }
        
        setTimeout(()=>{
          this.scrollToBottom();
        },200)
    });

    this.websocket.addEventListener('close', (event) => {
        
    });
  }

  isMe(sender:UserChatResponse)
  {
    return sender.email==this.authService.getEmailLocalStorage();
  }

  sendMsg()
  {
    if(!this.msg||this.msg.trim()=="")
    {
      return;
    }
    if (this.websocket.readyState === WebSocket.CLOSED) {
      this.alertify.warning(this.translate.instant('away'));
      return;
    }
    this.websocket.send(this.msg);
    this.msg=null;
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
  playSound(url,data) {
    try{
      if(this.isMe(data?.sender))
        return;
      document.getElementById("ss").click();
      const audio = new Audio(url);
      audio.play();
    }catch(e)
    {
      
    }
  }

  scrollToBottom(): void {
    try {
        if(!document.getElementById("room"))
          return;
        document.getElementById("room").scrollTop = document.getElementById("room").scrollHeight;
    } catch(err) { }                 
  }
  getFormat(createDate)
  {
    let date:Date = new Date();
    let target:Date = new Date(createDate);
    if (date.toDateString() === target.toDateString())
    {
      return "HH:mm:ss";
    }
    return "yyyy-MM-dd HH:mm:ss";
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

  getUsers(val)
  {
      this.searching=true;
        this.dataSent=true;
        this.chatService.getUsersByKeyword(val).subscribe(data=>{
          this.searchedUsers=data;
        },err=>{this.searchedUsers=[];})
        .add(()=>{this.dataSent=false;this.searching=false;})
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

  ngAfterViewInit(): void {
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

  addPersons()
  {
      if(!this.request.emails||this.request.emails.length==0)
      {
        this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
        return;
      }
      this.dataSent=true;
      this.chatService.addPersons(this.request,this.id).subscribe(
        res=>{
          this.participients=res.participants;
          this.data=res;
          this.request=new RoomRequest();
          this.opened=false;
          Swal.fire( { position: 'center', title: this.translate.instant("done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
        },err=>{
          this.handleRequestService.handleError(err);
        }
      ).add(()=>{this.dataSent=false});
  }

  removePerson(email)
  {
    this.dataSent=true;
    this.chatService.deletePersons(this.id,email).subscribe(
      res=>{
        this.participients=res.participants;
        this.data=res;
        this.request=new RoomRequest();
        this.opened=false;
        Swal.fire( { position: 'center', title: this.translate.instant("done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
      },err=>{
        this.handleRequestService.handleError(err);
      }
    ).add(()=>{this.dataSent=false});
  }

}
