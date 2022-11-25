import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/shared/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SupplierRequest } from 'src/app/entities/SupplierRequest';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ShowUserDataComponent } from '../show-user-data/show-user-data.component';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  data:SupplierRequest = new SupplierRequest();
  passwordMessages:string[]=[];
  display:string="CIN";
  loading:boolean=false;
  datos:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=["firstName","lastName","email"]
  /* Static columns 
  TODO translate status exist in StatusEnum [Backend] */
  fieldsStatic:string[]=["status"];
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
      ]),
    cin:new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10)
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

  clear()
  {
    this.data=new SupplierRequest();
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
    
  }

  get form() {
    return this.registerForm.controls;
  }

  private initData()
  {
    this.getData(0);
  }

  public getData(page:number)
  {
    this.isLoad=true;
    this.userService.getSuppliersWithPageAndSize(page,this.currentSize).subscribe(response=>{
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

  modifyAdmin()
  {
    this.dataSent=true;
    this.userService.updateAdminById(this.data,this.id).subscribe(
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
    this.id=refToUpdate;
    document.getElementById("formulaire").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
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
    this.userService.getSupplierById(id).subscribe(response=>{
      const dialogRef = this.dialog.open(ShowUserDataComponent, {
        width: '90%',
        data: {user: response,
        fields:["id","firstName","lastName","cin","email","socialReason","tradeName","lawForm","nrc",
        "commercialCourt","creationYear","ice","capitalMAD","officeAddress","officeZipCode","officeCountry",
        "officeCity","xAxisMap","yAxisMap","managerFullName","managerFunction","professionalFax",
        "professionalPhone","professionalEmail","website","totalEffective","turnoverN1","turnoverN2","turnoverN3","isoCertification",
        "otherIsoCertification",""],
        fieldsStatic:["supplierStatus","haveOtherLocation","haveMoroccanProducts"],
        fieldsDates:["createDate","modifyDate"],
        fieldsArrays:["activitySector","salesFamily","productsSold","authorizedContacts","formCompleters","settlements","moroccanProduct"],
        fieldsJson:[]
      },
      });
    },error=>{ this.handleRequestService.handleError(error)})
    .add(()=>{this.doingAction=false;this.doingActionTo=null;})
  }

}
