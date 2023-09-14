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
import { MatDialog } from '@angular/material/dialog';
import { ShowUserDataComponent } from '../show-user-data/show-user-data.component';
import { ValueLabelModel } from '../../../../entities/shared/ValueLabelModel';
import { Specification } from '../../../../entities/Specification';
import { BuyerService } from '../../../../services/buyer.service';
import { GeneralService } from '../../../../services/shared/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  data:SupplierRequest = new SupplierRequest();
  passwordMessages:string[]=[];
  loading:boolean=false;
  datos:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=["socialReason","firstName","lastName","email"]
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
  showForm:boolean=false;
  paramFilter:string=null;
  spec:Specification=new Specification();

  selectedSocials:string[]=[];
  selectedFunctions:string[]=[];
  selectedActivities:string[]=[];
  selectedFamily:string[]=[];
  capitalMAD:string=null;
  city:string=null;

  socials:string[]=[];
  socialsGlobal:string[]=[];
  family:ValueLabelModel[]=[];
  functions:ValueLabelModel[]=[];
  activities:ValueLabelModel[]=[];
  capitals:ValueLabelModel[]=[];
  list:string[] = ["0-3", "3-30", "30-75", "75-300", "SUP300"];

  nameFilter:string=null;
  showDisabledOnly:boolean=false;
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
    private buyerService:BuyerService,
    private snack:MatSnackBar,
    public dialog: MatDialog,
    private generalService:GeneralService,
    private translate:TranslateService) { 
      this.buyerService.getSocialReasons().subscribe(response=>{
        this.socials=response;
        this.socialsGlobal=response;
      })
      this.generalService.getSupplierConsts().subscribe(response=>{
        this.family=response.filter(e=>e.name=="salesfamily")[0].data;
        this.activities=response.filter(e=>e.name=="sectoractivity")[0].data;
        this.functions=response.filter(e=>e.name=="managerfunctions")[0].data;
      });
      for (let item of this.list) {
        let range = item.split('-').map(str => str.trim());
        if (range.length === 1) {
          this.capitals.push({ value: 'CAPSUP300', label: 'SUP300' });
        } else if (range.length === 2) {
          let minValue = range[0];
          let maxValue = range[1];
      
          this.capitals.push({ value: `CAP${minValue}_${maxValue}`, label: `${minValue}_${maxValue}CAPITAL` });
        }
      }
    }

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
    this.userService.getSuppliersWithPageAndSize(page,this.currentSize,this.spec).subscribe(response=>{
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
    this.showForm = false;
    this.id=refToUpdate;
    setTimeout(() => {
      this.showForm = true;
      let el = document.getElementById("formulaire");
      if(el)
        el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }, 0);
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
        fields:["id","firstName","lastName","email","socialReason","tradeName","lawForm","nrc",
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

  openChanged(e)
  {
    if(e==false)
    {
      this.socials=this.socialsGlobal;
      this.search=null;
    }
  }
  onKey(value) { 
    if(!this.search||this.search.trim()=="")
    {
      this.socials=this.socialsGlobal;
      return;
    }
    this.socials=this.socialsGlobal.filter(e=>e.toLowerCase().includes(this.search.toLowerCase()))
  }
  
  emptyJson(json:any):boolean
  {
    return Object.keys(json).length==0;
  }

  clearCapital(event){
    event.stopPropagation();
    this.capitalMAD=null;
  }

  filter()
  {
    this.spec.values={};
    if(this.selectedSocials&&this.selectedSocials.length!=0)
    {
      this.spec.values["socialReason"]=this.selectedSocials;
    }
    
    if(this.selectedFamily&&this.selectedFamily.length!=0)
    {
      this.spec.values["salesFamily"]=this.selectedFamily;
    }

    if(this.selectedActivities&&this.selectedActivities.length!=0)
    {
      this.spec.values["activitySector"]=this.selectedActivities;
    }
    if(this.selectedFunctions&&this.selectedFunctions.length!=0)
    {
      this.spec.values["managerFunction"]=this.selectedFunctions;
    }
    if(this.capitalMAD)
    {
      this.spec.values["capital"]=this.capitalMAD;
    }
    if(this.city&&this.city.trim()!=="")
    {
      this.spec.values["city"]=this.city;
    }
    if(this.nameFilter?.length>0)
    {
      this.spec.values["name"]=this.nameFilter;
    }
    if(!this.emptyJson(this.spec.values))
    {
      this.currentPage=0;
      this.filtered=true;
      this.getData(this.currentPage);
    }
    else{
      this.snack.open(this.translate.instant('emptydata'), this.translate.instant('close'));
    }
  }

  cancelFilter()
  {
    this.filtered=false;
    this.spec=new Specification();
    this.selectedActivities=[];
    this.selectedFamily=[];
    this.selectedFunctions=[];
    this.selectedSocials=[];
    this.capitalMAD=null;
    this.city=null;
    this.nameFilter=null;
    this.currentPage=0;
    this.getData(this.currentPage);
  }

}
