import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language/language.service';
import { RegisterModel } from 'src/app/entities/auth/register-model';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/shared/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyerRequest } from 'src/app/entities/BuyerRequest';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShowUserDataComponent } from '../show-user-data/show-user-data.component';
import { ValueLabelModel } from '../../../../entities/shared/ValueLabelModel';
import { Specification } from '../../../../entities/Specification';

@Component({
  selector: 'app-add-buyer',
  templateUrl: './add-buyer.component.html',
  styleUrls: ['./add-buyer.component.scss']
})
export class AddBuyerComponent implements OnInit {
  data:BuyerRequest = new BuyerRequest();
  passwordMessages:string[]=[];
  loading:boolean=false;
  datos:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=["firstName","lastName","email"]
  /* Static columns 
  TODO translate status exist in StatusEnum [Backend] */
  fieldsStatic:string[]=["expert","status"];
  fieldsDates:string[]=["createDate","modifyDate"];
  sizes:number[]=[5,10,20,50,100];
  isLoad:boolean=true;
  doingAction:boolean=false;
  doingActionTo:number=null;
  currentPage:number=0;
  currentSize:number=10;
  id:number;
  dataSent:boolean=false;
  isSubmitted:boolean=false;
  showForm:boolean=false;
  nameFilter:string=null;
  showDisabledOnly:boolean=false;
  paramFilter:string=null;
  spec:Specification=new Specification();
  filtered:boolean=false;
  


  search=null;


  registerForm = new FormGroup({
    email: new FormControl('',
    [

      Validators.required,
      Validators.email,
    ]),
    password: new FormControl(
    '',
    [
      Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    ]),
    phone:new FormControl(
      '',
      [
        Validators.required
      ]),
    firstName:new FormControl(
      '',
      [
        Validators.required
      ]),
    lastName:new FormControl(
      '',
      [
        Validators.required
      ])
  });

  constructor(
    private router: Router,
    private translateService:TranslateService,
    public languageService: LanguageService, 
    private userService : UserService, 
    private handleRequestService:HandleRequestService,
    private modalService:NgbModal,
    public dialog: MatDialog,
    private translate:TranslateService) { }


  cancelFilter(){
    this.currentPage=0;
    this.paramFilter=null;
    this.nameFilter=null;
    this.showDisabledOnly=false;
    this.filtered=false;
    this.initData();
  }

  filter(){
    this.filtered=true;
    this.currentPage=0;
    this.getData(0);
  }
    
  clear()
  {
    this.data=new BuyerRequest();
    this.isSubmitted=false;
  }

  onChangePassword(event){
    let data = this.data.password;
    this.passwordMessages=[];
    if(!data)
      return;
    if(data.toLowerCase()==data)
      this.passwordMessages.push("upperCaseRequired");
    if(data.toUpperCase()==data)
      this.passwordMessages.push("lowerCaseRequired");
    if(data.length<8)
      this.passwordMessages.push("lengthGtEights");
    if(!/\d/.test(data))
      this.passwordMessages.push("digitRequired");
    if(!/\[#?!@$%^&*-]/g.test(data))
      this.passwordMessages.push("specialCharRequired");
  }

  ngOnInit(): void {
    this.initData();
  }

  onRegister(e) {
    e.preventDefault();
    this.isSubmitted=true;
    this.dataSent=true;
    if(this.registerForm.valid)
    {
      let whatToSend:Observable<any> = this.userService.createUserBuyer(this.data);
      if(this.id)
      {
        this.data.id=this.id;
        whatToSend=this.userService.updateBuyerById(this.data,this.id);
      }
      whatToSend.subscribe(response=>{
          this.clear();
          this.isSubmitted=false;
          this.id=null;
          this.getData(this.currentPage);
          Swal.fire(
            {
              position: 'center',
              title: this.translateService.instant("success"),
              text: this.translateService.instant("done"),
              showConfirmButton: false,
              icon: 'success'
            }
          );
          this.showForm=false;
        },err=>{
          this.handleRequestService.handleError(err);
        }).add(()=>{
          this.dataSent=false;
        });
    }
    else
    {
      this.dataSent=false;
    }
  }

  get form() {
    return this.registerForm.controls;
  }

  private initData()
  {
    this.getData(0);
  }

  private getData(page:number)
  {
    this.isLoad=true;
    this.userService.getBuyersWithPageAndSize(page,this.currentSize,this.nameFilter,this.showDisabledOnly).subscribe(response=>{
        this.datos=response;
    },err=>{
        this.handleRequestService.handleErrorWithCallBack(err,()=>{
          this.router.navigate(["/error"]);
        });
    }).add(()=>{
      this.currentPage=page;
      this.isLoad=false;
    });
  }

  modifyBuyer()
  {
    this.dataSent=true;
    this.userService.updateBuyerById(this.data,this.id).subscribe(
      res=>{
          if(this.datos.pageDetails.numberOfElements<=1&&this.currentPage!=0)
            this.currentPage=this.currentPage-1;
          this.getData(this.currentPage);
          if(this.datos.content.length==0&&this.currentPage!=0) 
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
    this.showForm=false;
    this.doingAction=true;
    this.doingActionTo=index;
    this.userService.getBuyerById(refToUpdate).subscribe((res)=>{
      this.data=res;
      this.id=refToUpdate;
      this.showForm=true;
      document.getElementById("formulaire").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    },err=>{this.handleRequestService.handleError(err);})
    .add(()=>{this.doingAction=false;this.doingActionTo=null;});
  }

  deleteItem(componant,refToDelete,index){
    this.modalService.open(componant, {centered: true}).result.then((result) => {
      if(result == "save"){
      this.doingAction=true;
      this.doingActionTo=index;
      this.userService.deleteUser(refToDelete)
      .subscribe(e=>{
        if(this.datos.pageDetails.numberOfElements<=1&&this.currentPage!=0)
          this.currentPage=this.currentPage-1;
        this.getData(this.currentPage);
        if(this.datos.content.length==0&&this.currentPage!=0) 
        {
          this.getData(0);
        }
        Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
      },
      error=>{ this.handleRequestService.handleError(error)})
      .add(()=>{this.doingAction=false;this.doingActionTo=null;})
    }});
  }

  lockItem(componant,refToDelete,index){
    this.modalService.open(componant, {centered: true}).result.then((result) => {
      if(result == "save"){
      this.doingAction=true;
      this.doingActionTo=index;
      this.userService.lockUser(refToDelete)
      .subscribe(e=>{
        if(this.datos.pageDetails.numberOfElements<=1&&this.currentPage!=0)
          this.currentPage=this.currentPage-1;
        this.getData(this.currentPage);
        if(this.datos.content.length==0&&this.currentPage!=0) 
        {
          this.getData(0);
        }
        Swal.fire( { position: 'center', title: this.translate.instant("lock_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
      },
      error=>{ this.handleRequestService.handleError(error)})
      .add(()=>{this.doingAction=false;this.doingActionTo=null;})
    }});
  }

  unlockItem(componant,refToDelete,index){
    this.modalService.open(componant, {centered: true}).result.then((result) => {
      if(result == "save"){
      this.doingAction=true;
      this.doingActionTo=index;
      this.userService.unlockUser(refToDelete)
      .subscribe(e=>{
        if(this.datos.pageDetails.numberOfElements<=1&&this.currentPage!=0)
          this.currentPage=this.currentPage-1;
        this.getData(this.currentPage);
        if(this.datos.content.length==0&&this.currentPage!=0) 
        {
          this.getData(0);
        }
        Swal.fire( { position: 'center', title: this.translate.instant("unlock_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
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

  view(id,index)
  {
    this.doingAction=true;
    this.doingActionTo=index;
    this.userService.getBuyerById(id).subscribe(response=>{
      const dialogRef = this.dialog.open(ShowUserDataComponent, {
        width: '90%',
        data: {user: response,
        fields:["id","firstName","lastName","cin","email"],
        fieldsStatic:["expert","status"],
        fieldsDates:["createDate","modifyDate"],
        fieldsArrays:[],
        fieldsJson:[]
      },
      });
    },error=>{ this.handleRequestService.handleError(error)})
    .add(()=>{this.doingAction=false;this.doingActionTo=null;})
  }

  toggleExpert(id,expert,index)
  {
    this.doingAction=true;
    this.doingActionTo=index;
    this.userService.toggleBuyerExpert(id,!expert).subscribe(response=>{
      if(this.datos.pageDetails.numberOfElements<=1&&this.currentPage!=0)
        this.currentPage=this.currentPage-1;
      this.getData(this.currentPage);
      Swal.fire( { position: 'center', title: this.translate.instant("done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
    },error=>{ this.handleRequestService.handleError(error)})
    .add(()=>{this.doingAction=false;this.doingActionTo=null;})
  }
  
  
  emptyJson(json:any):boolean
  {
    return Object.keys(json).length==0;
  }

  

}
