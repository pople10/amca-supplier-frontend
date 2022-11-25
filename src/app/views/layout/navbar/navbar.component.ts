import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from 'src/app/services/shared/general.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { NotificationCode } from 'src/app/entities/enum/NotificationCode';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit,OnDestroy {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    public domSanitizer: DomSanitizer,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private generalService:GeneralService,
    public languageService: LanguageService
  ) {
    
    let userData = localStorage.getItem("userData") ?? null;
    this.authService.getMe().subscribe(
      reponse=>{
        delete reponse["roles"];
        delete reponse["id"];
        let datos = {};
        if(userData!=null)
          datos=JSON.parse(userData);
        localStorage.setItem("userData",JSON.stringify({...datos,...reponse}));
      }
    )
   }
  ngOnDestroy(): void {
    console.log("closed")
    this.websocket.close();
  }

  username:string;
  roles:string[];
  userImage:string;
  showNotificationCircle:boolean = false;
  isAdmin:false;

  websocket:any;

  notifications:any[]=[];

  attempts:number=0;

  ngOnInit(): void {

    let userData = localStorage.getItem("userData") ?? null;
    if(userData == null){
      this.authService.logOut();
    }else{
      this.authService.setUserData(JSON.parse(localStorage.getItem("userData")));
    }
    this.authService.userData$.subscribe((res)=>{
      this.username = res.firstName;
      this.roles = res.roles;
      this.isAdmin = (res.roles.includes("admin") != null) ? res.roles.includes("admin") : false;
    });

    this.openNotificationWS();

    setInterval(()=>{
      this.sendMessageWS(NotificationCode.check);
    },500)
  }

  sendMessageWS(type:NotificationCode)
  {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(type);
    }
  }

  openNotificationWS()
  {
    
    this.websocket=this.generalService.getNotificationWebSocket();
    this.websocket.addEventListener('open', (event) => {
      this.attempts=0;
    });

    this.websocket.addEventListener("error",(event)=>{
      
    })
    
    // Listen for messages
    this.websocket.addEventListener('message', (event) => {
        let received = JSON.parse(event.data);
        this.notifications=received;
    });

    this.websocket.addEventListener('close', (event) => {
        this.attempts++;
        console.info("Attempting to reconnect")
        if(this.attempts<50)
          this.openNotificationWS();
    });

  }

  openNotification()
  {
    if(!this.notifications||this.notifications.length==0||this.notifications["constructor"]!=Array) return;
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '50%',
      maxHeight:'50%',
      data: {'notifications':this.notifications,'callback':()=>{
        this.sendMessageWS(NotificationCode.clear);
      }},
    });
  }

  changeLanguage(language){
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage(){
    return localStorage.getItem("userLanguage") ?? "fr";
  }

  toggleSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  onLogout(e) {
    e.preventDefault();
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }

}
