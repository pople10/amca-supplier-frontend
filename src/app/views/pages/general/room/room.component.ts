import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { WebSocketSubject } from 'rxjs/webSocket';
import { RoomMessageResponse } from 'src/app/entities/RoomMessageResponse';
import { RoomResponse } from 'src/app/entities/RoomResponse';
import { UserChatResponse } from 'src/app/entities/UserChatResponse';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { AlertifyService } from 'src/app/services/shared/alertify.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit,OnDestroy {
  msg:string=null;
  id:number;
  showParticipients:boolean=false;
  participients:UserChatResponse[]=[];
  data:RoomResponse=new RoomResponse();
  websocket:any;
  messages:RoomMessageResponse[]=[];

  constructor(
    private chatService:ChatService,
    private handleRequestService:HandleRequestService,
    public languageService:LanguageService,
    private route: ActivatedRoute,
    private alertify:AlertifyService,
    private translate:TranslateService,
    private snackBar:MatSnackBar,
    private router:Router,
    private authService:AuthService
  ) { 
    this.id=parseInt(this.route.snapshot.paramMap.get('id'));
    this.chatService.getRoom(this.id).subscribe(data=>{
      this.participients=data.participants;
      this.data=data;
    },err=>{
      this.handleRequestService.handleError(err);
      this.router.navigate(["/general/rooms"]);
    })
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
    if(!this.msg||this.msg=="")
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

}
