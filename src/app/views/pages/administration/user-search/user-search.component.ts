import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserChatResponse } from 'src/app/entities/UserChatResponse';
import { ChatService } from 'src/app/services/chat.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import { UserService } from 'src/app/services/shared/users.service';
import { ShowUserDataComponent } from '../show-user-data/show-user-data.component';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit,AfterViewInit {
  toBeAdd:string;
  searchedUsers:UserChatResponse[]=[];
  dataSent:boolean=false;
  loadData:boolean=false;
  searching:boolean=false;
  @ViewChild('addMail') selectInput;

  onChangeKeyword(e)
  {
    if(!e) return;
    this.dataSent=true;
    this.loadData=true;
    this.userService.getUser(e).subscribe(response=>{
      const dialogRef = this.dialog.open(ShowUserDataComponent, {
        width: '90%',
        data: {user: response,
        fields:["id","firstName","lastName","cin","email"],
        fieldsStatic:["status"],
        fieldsDates:["createDate","modifyDate"],
        fieldsArrays:[],
        fieldsJson:[]
      },
      });
    },error=>{ this.handleRequestService.handleError(error)})
    .add(()=>{this.dataSent=false;this.loadData=false;})
  }

  constructor(
    private chatService:ChatService,
    private handleRequestService:HandleRequestService,
    private userService:UserService,
    public dialog: MatDialog,
    public languageService:LanguageService
    ) 
    {
      
    }

  ngOnInit(): void {
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
    const input = this.selectInput.element.children[0].children[0].children[1].children[0];
    input.addEventListener("keyup", (data)=>{
      let val = input?.value;
      if(val&&val.length>=1)
      {
        this.getUsers(val);
        return;
      }
      this.searchedUsers=[];
    });
  }

}
