import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language/language.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { REGIONS } from 'src/app/lists/regions';
import { VILLES } from 'src/app/lists/villes';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/shared/general.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import { SupplierRequest } from 'src/app/entities/SupplierRequest';
import { ProductModel } from 'src/app/entities/ProductModel';
import { MemberModel } from 'src/app/entities/MemberModel';
import { SettlementModel } from 'src/app/entities/SettlementModel';

@Component({
  selector: 'app-supplier-register',
  templateUrl: './supplier-register.component.html',
  styleUrls: ['./supplier-register.component.scss']
})
export class SupplierRegisterComponent implements OnInit {
  onSubmitPage11() {
    if(!this.isLodedAllPage){
          this.onDone();
          this.AfterCheckLastPage();
    }
  }

  /*****    flags for update any item     *****/
  refToUpdate:string=null;

  /*****    Fome Group for validation     *****/
  validationForm1: FormGroup;
  validationForm2: FormGroup;
  validationFormFiles:FormGroup;
  validationForm3: FormGroup;
  validationForm4: FormGroup;
  validationForm5: FormGroup;
  validationForm6: FormGroup;
  validationForm7: FormGroup;
  validationForm8: FormGroup;
  validationForm9: FormGroup;
  validationForm10: FormGroup;

  /*****    Submit Data     *****/
  supplierRequest:SupplierRequest=new SupplierRequest();
  selectedProduct:any={};
  product:ProductModel=new ProductModel();
  authorize:MemberModel=new MemberModel();
  completer:MemberModel=new MemberModel();
  settlement:SettlementModel=new SettlementModel();
  page:any=1;
  lastPage:any=11;
  isFormSubmitted: Boolean;
  thisYear:number=new Date().getFullYear();

  /*****   Inputs : Generation in HTML by *ngFor    *****/
  inputsStep1;
  inputsStep2:Array<any>;
  inputsStep3;
  inputsStep4;
  inputsStep5;
  inputsStep6;
  inputsStep7;
  inputsStep8;
  inputsStep9;
  inputsStep10;
  /*********** Values ****** */
  lawFormValues:any;
  commercialCourtValues:any;
  salesfamilyValues:any;
  managerfunctionsValues:any;
  countryValues:any;
  sectoractivityValues:any;
  isocertificatesValues:any;
  functionalityValues:any;
  settlementValues:any;

  /*****   Flags    *****/
  isDisabled:Boolean=false;
  isModification:Boolean=false;
  isLoded:Boolean=false;
  isInError:Boolean=false;
  isLodedAllPage:Boolean=false;
  iseditablePage2:Boolean=false;
  isdisableLoadModal:Boolean=true;
  noEdition:Boolean=false;
  NumberCodeForm="212";
  isMobile = false;

  regions = REGIONS;
  villes = VILLES;
  genderOption = [{id:'H',label:'Homme'},{id:'F',label:'Femme'}];
  roleOption = [{id:"1",label:'Role 1'},{id:"2",label:'Role 2'}];
  maritalStatusOption=[{value:"MARRIED",labelFr:"Marié(e)",labelAr:"(ة)متزوج"},
                        {value:"SINGLE",labelFr:"Célibataire(e)",labelAr:"(ة)أعزب"},
                        {value:"DIVORCED",labelFr:"Divorcé(e)",labelAr:"(ة)مطلق"}];
  identityTypeOption=[{value:"CIN_CARD",labelFr:"Carte d'identité nationale",labelAr:"بطاقة التعريف الوطنية"},
                      {value:"PASSPORT",labelFr:"Passeport",labelAr:"جواز سفر"},
                      {value:"DRIVER_LICENSE_CARD",labelFr:"Permis de conduire",labelAr:"بطاقة رخصة السائق"},
                      {value:"RESIDENT_CARD",labelFr:"Carte de séjour",labelAr:"بطاقة اقامة"}]                      
  DataPage1 = {
    "firstName":[Validators.required,Validators.maxLength(72)],
    "lastName":[Validators.required,Validators.maxLength(72)],
    "cin":[Validators.required],
    "email":[Validators.required,Validators.email],
    "phone":[Validators.required],
    "password":[Validators.required]
  };
  DataPage2 = {
    "socialReason":[Validators.required],
    "tradeName":[],
    "lawForm":[Validators.required],
    "nrc":[],
    "commercialCourt":[],
    "creationYear":[Validators.required,Validators.max(new Date().getFullYear()),Validators.min(1000)],
    "ice":[Validators.required],
    "capitalMAD":[Validators.required]
  };
  DataPage3 = {
    "officeAddress":[Validators.required],
    "officeZipCode":[Validators.required],
    "officeCountry":[Validators.required],
    "officeCity":[Validators.required],
    "xAxisMap":[],
    "yAxisMap":[]
  };
  DataPage4 = {
    "managerFullName":[Validators.maxLength(72)],
    "managerFunction":[],
    "professionalFax":[],
    "professionalPhone":[],
    "professionalEmail":[Validators.email],
    "website":[Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]
  }
  DataPage5 = {
    "activitySector":[Validators.required],
    "totalEffective":[],
    "turnoverN1":[],
    "turnoverN2":[],
    "turnoverN3":[],
    "isoCertification":[],
    "otherIsoCertification":[],
    "salesFamily":[Validators.required]
  };
  DataPage6 = {
    "productName":[Validators.required]
  };
  DataPage7 = {
    "fullName":[Validators.required],
    "email":[Validators.required,Validators.email],
    "functionality":[Validators.required],
    "phone":[Validators.required],
    "fax":[Validators.required]
  };
  DataPage8 = {
    "haveOtherLocation":[Validators.required],
    "settlementType":[Validators.required],
    "city":[Validators.required],
    "country":[Validators.required],
    "email":[Validators.required,Validators.email]
  }
  DataPage9 = {
    "haveMoroccanProducts":[Validators.required],
    "products":[Validators.required],
    "brand":[Validators.required],
    "integrationRate":[Validators.required,Validators.max(100),Validators.min(0)]
  };
  DataPage10 = {
    "fullName":[Validators.required],
    "email":[Validators.required,Validators.email],
    "functionality":[Validators.required],
    "phone":[Validators.required]
  }
  DataPages= [this.DataPage1,this.DataPage2,this.DataPage3,this.DataPage4,this.DataPage5,this.DataPage6,this.DataPage7,this.DataPage8,this.DataPage9,this.DataPage10];
  Files = [];

  initForme1(){
    this.inputsStep1 = [
      {type:"simpleInput",data:{formControlName:"firstName",label:"firstName",placeHolder:"",type:"text",ngModel:this.supplierRequest.firstName,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','firstName')},required:true}},
      {type:"simpleInput",data:{formControlName:"lastName",label:"lastName",placeHolder:"",type:"text",ngModel:this.supplierRequest.lastName,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','lastName')},required:true}},
      {type:"simpleInput",data:{formControlName:"cin",label:"cin",placeHolder:"",type:"text",ngModel:this.supplierRequest.cin,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','cin')},required:true}},
      {type:"simpleInput",data:{formControlName:"email",label:"email",placeHolder:"",type:"text",ngModel:this.supplierRequest.email,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','email')},required:true}},
      {type:"phoneNumber",data:{formControlName:"phone",label:"phone",placeHolder:"",type:"tel",ngModel:this.supplierRequest.phone,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','phone')},required:true}},
      {type:"simpleInput",data:{formControlName:"password",label:"password",placeHolder:"",type:"password",ngModel:this.supplierRequest.password,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','password')},required:true}},
      ];
  }
  initForme2()
  {
    this.inputsStep2=[
      {type:"simpleInput",data:{formControlName:"socialReason",label:"socialReason",placeHolder:"",type:"text",ngModel:this.supplierRequest.socialReason,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','socialReason')},required:true}},
      {type:"simpleInput",data:{formControlName:"tradeName",label:"tradeName",placeHolder:"",type:"text",ngModel:this.supplierRequest.tradeName,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','tradeName')},required:false}},
      {type:"selectInput",data:{formControlName:"lawForm",label:"lawForm",placeHolder:"",type:"text",ngModel:'supplierRequest.lawForm',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','lawForm')},required:true,options:'lawForm',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"simpleInput",data:{formControlName:"nrc",label:"nrc",placeHolder:"",type:"number",ngModel:this.supplierRequest.nrc,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','nrc')},required:false}},
      {type:"selectInput",data:{formControlName:"commercialCourt",label:"commercialCourt",placeHolder:"",type:"text",ngModel:'supplierRequest.commercialCourt',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','commercialCourt')},required:false,options:'commercialCourt',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"simpleInput",data:{formControlName:"creationYear",label:"creationYear",placeHolder:"",type:"number",ngModel:this.supplierRequest.creationYear,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','creationYear')},required:true,max:new Date().getFullYear()}},
      {type:"simpleInput",data:{formControlName:"ice",label:"ice",placeHolder:"",type:"text",ngModel:this.supplierRequest.ice,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','ice')},required:true}},
      {type:"simpleInput",data:{formControlName:"capitalMAD",label:"capitalMAD",placeHolder:"",type:"number",ngModel:this.supplierRequest.capitalMAD,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','capitalMAD')},required:true}},
    ];
  }
  initinputsStep2= ()=>{    
    this.inputsStep2=[

    ];
    let data =[];
    for(let k of this.Files){
      this.inputsStep2.push({file:null,documentType:k,key:k,data:{name:"",refDocument:""},accept:"image/jpeg,image/jpg,image/png,application/pdf",required:true});
      data[k]=[null, Validators.required];
    }
    this.validationFormFiles = this.formBuilder.group({...data});
  }
  initForme3= ()=>{    
    this.inputsStep3 = [
      {type:"simpleInput",data:{formControlName:"officeAddress",label:"officeAddress",placeHolder:"",type:"text",ngModel:this.supplierRequest.officeAddress,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','officeAddress')},required:true}},
      {type:"simpleInput",data:{formControlName:"officeZipCode",label:"officeZipCode",placeHolder:"",type:"text",ngModel:this.supplierRequest.officeZipCode,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','officeZipCode')},required:true}},
      {type:"selectInput",data:{formControlName:"officeCountry",label:"officeCountry",placeHolder:"",type:"text",ngModel:'supplierRequest.officeCountry',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','officeCountry')},required:true,options:'countries',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"selectInput",data:{formControlName:"officeCity",label:"officeCity",placeHolder:"",type:"text",ngModel:'supplierRequest.officeCity',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','officeCity')},required:true,options:'villes',value:'ville',labelS:'ville',getLabel:(r)=>{return r.ville;},multiple:false,free:true}},
      {type:"simpleInput",data:{formControlName:"xAxisMap",label:"xAxisMap",placeHolder:"",type:"text",ngModel:this.supplierRequest.xAxisMap,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','xAxisMap')},required:false}},
      {type:"simpleInput",data:{formControlName:"yAxisMap",label:"yAxisMap",placeHolder:"",type:"text",ngModel:this.supplierRequest.yAxisMap,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','yAxisMap')},required:false}},
    ];
  }
  initForme4= ()=>{    
    this.inputsStep4 = [
      {type:"simpleInput",data:{formControlName:"managerFullName",label:"managerFullName",placeHolder:"",type:"text",ngModel:this.supplierRequest.managerFullName,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','managerFullName')},required:false}},
      {type:"selectInput",data:{formControlName:"managerFunction",label:"managerFunction",placeHolder:"",type:"text",ngModel:'supplierRequest.managerFunction',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','managerFunction')},required:false,options:'functions',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"phoneNumber",data:{formControlName:"professionalFax",label:"professionalFax",placeHolder:"",type:"text",ngModel:this.supplierRequest.professionalFax,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','professionalFax')},required:false}},
      {type:"phoneNumber",data:{formControlName:"professionalPhone",label:"professionalPhone",placeHolder:"",type:"tel",ngModel:this.supplierRequest.professionalPhone,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','professionalPhone')},required:false}},
      {type:"simpleInput",data:{formControlName:"professionalEmail",label:"professionalEmail",placeHolder:"",type:"text",ngModel:this.supplierRequest.professionalEmail,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','professionalEmail')},required:false}},
      {type:"simpleInput",data:{formControlName:"website",label:"website",placeHolder:"",type:"text",ngModel:this.supplierRequest.website,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','website')},required:false}},
    ];
  }
  initForme5= ()=>{    
    this.inputsStep5 = [
      {type:"selectInput",data:{formControlName:"activitySector",label:"activitySector",placeHolder:"",type:"text",ngModel:'supplierRequest.activitySector',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','activitySector')},required:true,options:'activitySector',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:true,free:true}},
      {type:"simpleInput",data:{formControlName:"totalEffective",label:"totalEffective",placeHolder:"",type:"number",ngModel:this.supplierRequest.totalEffective,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','totalEffective')},required:false}},
      {type:"simpleInput",data:{formControlName:"turnoverN1",label:"turnoverN1",placeHolder:"",type:"number",ngModel:this.supplierRequest.turnoverN1,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','turnoverN1')},required:false}},
      {type:"simpleInput",data:{formControlName:"turnoverN2",label:"turnoverN2",placeHolder:"",type:"number",ngModel:this.supplierRequest.turnoverN2,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','turnoverN2')},required:false}},
      {type:"simpleInput",data:{formControlName:"turnoverN3",label:"turnoverN3",placeHolder:"",type:"number",ngModel:this.supplierRequest.turnoverN3,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','turnoverN3')},required:false}},
      {type:"selectInput",data:{formControlName:"isoCertification",label:"isoCertification",placeHolder:"",type:"text",ngModel:'supplierRequest.isoCertification',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','isoCertification')},required:true,options:'isocertificates',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"simpleInput",data:{formControlName:"otherIsoCertification",label:"otherIsoCertification",placeHolder:"",type:"text",ngModel:this.supplierRequest.otherIsoCertification,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','otherIsoCertification')},required:false}},
      {type:"selectInput",data:{formControlName:"salesFamily",label:"salesFamily",placeHolder:"",type:"text",ngModel:'supplierRequest.salesFamily',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','salesFamily')},required:true,options:'salesFamily',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:true,free:false}},
    ];
  }
  initForme6 = ()=>{    
    this.inputsStep6 = [
      {type:"simpleInput",data:{formControlName:"productName",label:"productName",placeHolder:"",type:"text",ngModel:this.selectedProduct.productName,onChange:(v)=>{this.onChangevalue(v,'selectedProduct','productName')},required:true}},
    ];
  }
  initForme7 = ()=>{
    this.inputsStep7 = [
      {type:"simpleInput",data:{formControlName:"fullName",label:"fullName",placeHolder:"",type:"text",ngModel:this.authorize.fullName,onChange:(v)=>{this.onChangevalue(v,'authorize','fullName')},required:true}},
      {type:"simpleInput",data:{formControlName:"email",label:"email",placeHolder:"",type:"email",ngModel:this.authorize.email,onChange:(v)=>{this.onChangevalue(v,'authorize','email')},required:true}},
      {type:"selectInput",data:{formControlName:"functionality",label:"functionality",placeHolder:"",type:"text",ngModel:'authorize.functionality',onChange:(v)=>{this.onChangevalue(v,'authorize','functionality')},required:true,options:'functionality',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"phoneNumber",data:{formControlName:"phone",label:"phone",placeHolder:"",type:"text",ngModel:this.authorize.phone,onChange:(v)=>{this.onChangevalue(v,'authorize','phone')},required:true}},
      {type:"phoneNumber",data:{formControlName:"fax",label:"fax",placeHolder:"",type:"text",ngModel:this.authorize.fax,onChange:(v)=>{this.onChangevalue(v,'authorize','fax')},required:true}},
    ];
  }
  initForme8 = ()=>{
    this.inputsStep8 = [
      {type:"selectInput",data:{formControlName:"settlementType",label:"settlementType",placeHolder:"",type:"text",ngModel:'settlement.settlementType',onChange:(v)=>{this.onChangevalue(v,'settlement','settlementType')},required:true,options:'settlement',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"simpleInput",data:{formControlName:"email",label:"email",placeHolder:"",type:"email",ngModel:this.settlement.email,onChange:(v)=>{this.onChangevalue(v,'settlement','email')},required:true}},
      {type:"selectInput",data:{formControlName:"country",label:"country",placeHolder:"",type:"text",ngModel:'settlement.country',onChange:(v)=>{this.onChangevalue(v,'settlement','country')},required:true,options:'countries',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"selectInput",data:{formControlName:"city",label:"city",placeHolder:"",type:"text",ngModel:'settlement.city',onChange:(v)=>{this.onChangevalue(v,'settlement','city')},required:true,options:'villes1',value:'ville',labelS:'ville',getLabel:(r)=>{return r.ville;},multiple:false,free:true}}
    ];
  }
  initForme9 = ()=>{
    this.inputsStep9 = [
      {type:"selectInput",data:{formControlName:"products",label:"products",placeHolder:"",type:"text",ngModel:'product.products',onChange:(v)=>{this.onChangevalue(v,'product','products')},required:true,options:'none',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:true,free:true}},
      {type:"simpleInput",data:{formControlName:"brand",label:"brand",placeHolder:"",type:"text",ngModel:this.product.brand,onChange:(v)=>{this.onChangevalue(v,'product','brand')},required:true}},
      {type:"simpleInput",data:{formControlName:"integrationRate",label:"integrationRate",placeHolder:"",type:"number",ngModel:this.product.integrationRate,onChange:(v)=>{this.onChangevalue(v,'product','integrationRate')},required:true,max:100,min:0}},
    ];
  }
  initForme10 = ()=>{
    this.inputsStep10 = [
      {type:"simpleInput",data:{formControlName:"fullName",label:"fullName",placeHolder:"",type:"text",ngModel:this.completer.fullName,onChange:(v)=>{this.onChangevalue(v,'completer','fullName')},required:true}},
      {type:"simpleInput",data:{formControlName:"email",label:"email",placeHolder:"",type:"email",ngModel:this.completer.email,onChange:(v)=>{this.onChangevalue(v,'completer','email')},required:true}},
      {type:"selectInput",data:{formControlName:"functionality",label:"functionality",placeHolder:"",type:"text",ngModel:'completer.functionality',onChange:(v)=>{this.onChangevalue(v,'completer','functionality')},required:true,options:'functionality',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false,free:true}},
      {type:"phoneNumber",data:{formControlName:"phone",label:"phone",placeHolder:"",type:"text",ngModel:this.completer.phone,onChange:(v)=>{this.onChangevalue(v,'completer','phone')},required:true}}
    ];
  }
  getFormGroupValidation(page,data){
    switch (page) {
      case 1:
         this.validationForm1=data;
         break;
      case 2:
         this.validationForm2=data;
         break;
      case 3:
         this.validationForm3=data;
         break;
      case 4:
           this.validationForm4=data;
           break;
      case 5:
           this.validationForm5=data;
           break;
      case 6:
          this.validationForm6=data;
          break;
      case 7:
          this.validationForm7=data;
          break;
      case 8:
          this.validationForm8=data;
          break;
      case 9:
          this.validationForm9=data;
          break;
      case 10:
          this.validationForm10=data;
          break;
      default:
        break;
    }
  }
  get getFormGroup(){
    switch (this.page) {
      case 1:
          return this.validationForm1;
      case 2:
          return this.validationForm2;
      case 3:
          return this.validationForm3;
      case 4:
          return this.validationForm4;
      case 5:
          return this.validationForm5;
      case 6:
          return this.validationForm6;
      case 7:
          return this.validationForm7;
      case 8:
          return this.validationForm8;
      case 9:
          return this.validationForm9;
      case 10:
          return this.validationForm10;
      case 11:
          return this.validationForm10;
      default:
        break;
    }
  }
  get form(){
    return this.getFormGroup.controls;
  }
  constructor(private handleService:HandleRequestService,private generalService:GeneralService,private route: ActivatedRoute,public formBuilder: FormBuilder,private translate: TranslateService,private router:Router,private modalService: NgbModal, private authService: AuthService,public  languageService: LanguageService,private snackBar:MatSnackBar,) {
    this.isLoded=true;
    this.isLodedAllPage=true;
    this.generalService.getSupplierConsts().subscribe(res=>{
      this.lawFormValues=res.filter(e=>(e.name=="lawform"))[0]?.data
      this.commercialCourtValues=res.filter(e=>(e.name=="commercialcourt"))[0].data
      this.salesfamilyValues=res.filter(e=>(e.name=="salesfamily"))[0].data;
      this.managerfunctionsValues=res.filter(e=>(e.name=="managerfunctions"))[0].data;
      this.countryValues=res.filter(e=>(e.name=="country"))[0].data;
      this.sectoractivityValues=res.filter(e=>(e.name=="sectoractivity"))[0].data;
      this.isocertificatesValues=res.filter(e=>(e.name=="isocertificates"))[0].data;
      this.functionalityValues=res.filter(e=>(e.name=="functions"))[0].data;
      this.settlementValues=res.filter(e=>(e.name=="settlement"))[0].data;
    },err=>{
      this.handleService.handleError(err);
    })
    this.initFormValidator();
    window.addEventListener("resize", ()=>{
      if(document.documentElement.clientWidth <= 720){
        this.isMobile = true;
      }else{
        this.isMobile = false;
      }
    });
  }

  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;

  ngOnInit(): void {
    this.refToUpdate=this.route.snapshot.paramMap.get('ref');
    this.getinitialData();
  }
  onInitAllData(){
    if(!this.isLodedAllPage)
      if(!this.isDisabled && !this.isFormSubmitted)
        setTimeout(() => {
          this.onFormSubmit()
        }, 500);
  }
  getinitialData = ()=>{
   
  }
  initFormValidator(){
    let cmp=0;
    for(let pageForm of this.DataPages)
    {
      var datos={};
      for(let key in  pageForm)
      {
         datos[key]=['', pageForm[key]];
      }
      this.getFormGroupValidation(cmp+1,this.formBuilder.group({...datos}));
      cmp++;
    }
  }
  getArtistAccountFile = ():any=>{
    return this.inputsStep2;
  }
  onFormSubmit = ()=>{
    this.isFormSubmitted=true;
    this.isInError=false;
    switch(this.page) {
      case 1:
        return this.onSubmitPage1();
      case 2:
        return this.onSubmitPage2();
      case 3:
        return this.onSubmitPage3();
      case 4:
        return this.onSubmitPage4();
      case 5:
        return this.onSubmitPage5();
      case 6:
        return this.onSubmitPage6();
      case 7:
          return this.onSubmitPage7();
      case 8:
          return this.onSubmitPage8();
      case 9:
          return this.onSubmitPage9();
      case 10:
          return this.onSubmitPage10();
      case 11:
          return this.onSubmitPage11();
      default:
        return null;
    }
  }
  onSubmitPage1 = ()=>{
    if(this.validationForm1.valid){
      this.onDone();
    }
    else {
      this.isDisabled=false;
      this.AfterCheckLastPage();
    }
  }
  onSubmitPage2 = ()=>{
    if(this.validationForm2.valid){
      this.isDisabled = true;
      this.onDone();
    }
    else {
      this.isDisabled=false;
      this.AfterCheckLastPage();
    }
  }    
  onSubmitPage3 = ()=>{
    if(this.validationForm3.valid){
      this.isDisabled = true;
      this.onDone();
    }
    else {
      this.isDisabled=false;
      this.AfterCheckLastPage();
    }
  }
  onSubmitPage4 = ()=>{
    if(this.validationForm4.valid){
      this.isDisabled = true;
      this.onDone();
    }
    else {
      this.isDisabled=false;
      this.AfterCheckLastPage();
    }
  }
  onSubmitPage5 = ()=>{
    if(this.validationForm5.valid){
      this.isDisabled = true;
      this.onDone();
    }
    else {
      this.isDisabled=false;
      this.AfterCheckLastPage();
    }
  }

  onSubmitPage6()
  {
    if(!this.supplierRequest.productsSold||this.supplierRequest.productsSold.length==0)
    {
      this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    this.onDone();
  }

  onSubmitPage7()
  {
    if(!this.supplierRequest.authorizedContacts||this.supplierRequest.authorizedContacts.length==0)
    {
      this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    this.onDone();
  }

  onSubmitPage8()
  {
    if(this.supplierRequest.haveOtherLocation!=false&&(!this.supplierRequest.settlements||this.supplierRequest.settlements.length==0))
    {
      this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    this.onDone();
  }

  onSubmitPage9()
  {
    if(this.supplierRequest.haveMoroccanProducts!=false&&(!this.supplierRequest.moroccanProduct||this.supplierRequest.moroccanProduct.length==0))
    {
      this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    this.onDone();
  }

  onSubmitPage10()
  {
    if(!this.supplierRequest.formCompleters||this.supplierRequest.formCompleters.length==0)
    {
      this.snackBar.open(this.translate.instant('emptydata'), this.translate.instant('close'));
      return;
    }
    this.onDone();
  }
  
  
  onAddForm3(e){
    
  }
  
  
  onInitPage1(){
    this.page=1;
    this.initForme1();
    
  }

  onInitPage2(){
    this.page=2;
    this.initForme2();
    
  }

  onInitPage3(){
    this.page=3;
    this.initForme3();
  }
  onInitPage4()
  {
    this.page=4;
    this.initForme4();
  }
  onInitPage5()
  {
    this.page=5;
    this.initForme5();
  }
  onInitPage6()
  {
    this.page=6;
    this.initForme6();
  }
  onInitPage7()
  {
    this.page=7;
    this.initForme7();
  }
  onInitPage8()
  {
    this.page=8;
    this.initForme8();
  }
  onInitPage9()
  {
    this.page=9;
    this.initForme9();
  }
  onInitPage10()
  {
    this.page=10;
    this.initForme10();
  }
  deleteEForm6(c,i){
    this.modalService.open(c, {centered: true}).result.then((result) => {
      if(result == "save"){
        this.supplierRequest.productsSold=this.supplierRequest.productsSold.filter(e=>e!=i);
        Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
    }});
  }
  deleteEForm7(c,i){
    this.modalService.open(c, {centered: true}).result.then((result) => {
      if(result == "save"){
        this.supplierRequest.authorizedContacts=this.supplierRequest.authorizedContacts.filter((e,k)=>k!=i);
        Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
    }});
  }
  deleteEForm8(c,i)
  {
    this.modalService.open(c, {centered: true}).result.then((result) => {
      if(result == "save"){
        this.supplierRequest.settlements=this.supplierRequest.settlements.filter((e,k)=>k!=i);
        Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
    }});
  }
  deleteEForm9(c,i)
  {
    this.modalService.open(c, {centered: true}).result.then((result) => {
      if(result == "save"){
        this.supplierRequest.moroccanProduct=this.supplierRequest.moroccanProduct.filter((e,k)=>k!=i);
        Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
    }});
  }
  deleteEForm10(c,i)
  {
    this.modalService.open(c, {centered: true}).result.then((result) => {
      if(result == "save"){
        this.supplierRequest.formCompleters=this.supplierRequest.formCompleters.filter((e,k)=>k!=i);
        Swal.fire( { position: 'center', title: this.translate.instant("table_delete_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
    }});
  }
  onAddForm6(e)
  {
    e.preventDefault();
    this.isFormSubmitted=true;
    if(this.validationForm6.valid)
    {
      this.supplierRequest.productsSold.push(this.selectedProduct?.productName);
      this.selectedProduct.productName="";
      this.initForme6();
      this.isFormSubmitted=false;
    }
  }
  changeYesQuestion(e,key,clear)
  {
    if(e.target.value == "n"){
      this.supplierRequest[key] = false;
      this.supplierRequest[clear]=[];
    }else{
      this.supplierRequest[key] = true;
    }
  }
  onAddForm7(e)
  {
    e.preventDefault();
    this.isFormSubmitted=true;
    if(this.validationForm7.valid)
    {
      this.supplierRequest.authorizedContacts.push(this.authorize);
      this.authorize=new MemberModel();
      this.isFormSubmitted=false;
      this.initForme7();
    }
  }
  onAddForm8(e)
  {
    e.preventDefault();
    this.isFormSubmitted=true;
    if(this.validationForm8.valid)
    {
      this.supplierRequest.settlements.push(this.settlement);
      this.settlement=new SettlementModel();
      this.isFormSubmitted=false;
      this.initForme8();
    }
  }
  onAddForm9(e)
  {
    e.preventDefault();
    this.isFormSubmitted=true;
    if(this.validationForm9.valid)
    {
      this.supplierRequest.moroccanProduct.push(this.product);
      this.product=new ProductModel();
      this.isFormSubmitted=false;
      this.initForme9();
    }
  }
  onAddForm10(e)
  {
    e.preventDefault();
    this.isFormSubmitted=true;
    if(this.validationForm10.valid)
    {
      this.supplierRequest.formCompleters.push(this.completer);
      this.completer=new MemberModel();
      this.isFormSubmitted=false;
      this.initForme10();
    }
  }
  onStepOneDone = ()=>{
    this.isModification=true;
    this.isdisableLoadModal=true;
    this.isFormSubmitted=false;
    this.isDisabled=false;
    this.isInError=false;
    this.wizardForm.goToNextStep();
  }
  previousPage(){
    this.onStepOneDone()
    this.wizardForm.goToPreviousStep();
  }
  nextPage(){
    this.onStepOneDone()
    this.wizardForm.goToNextStep();
    this.onInitAllData();
  }
  onChangevalue = (value,firstkey,key:string)=>{
    let keys = key.split(".");
    var d = this[firstkey];
    for(var i =0;i<keys.length-1;i++)
        d=d[keys[i]];
    d[keys[i]]=value;
  }
  onChangevalueSingle(value,key:string)
  {
    this[key]=value;
  }
  onChangeRegion = (value)=>{
    
  }
  onChangeVille = (value)=>{
    
  }
  onChangeFile = (event,index)=>{
    if (event.target.files.length) {
      let file = event.target.files[0];
      let elementFile:any = this.inputsStep2[index];
      elementFile.data.name=file.name;
      elementFile.file=file;
      let x = {};
      x[elementFile.key]=file;
      this.getFormGroup.patchValue({...x});
    }
  }
  downloadFile = (index,refDoc)=>{
    if(refDoc!=null){
    let icon:HTMLElement=document.querySelector("#"+refDoc+index+" .download-icon") as HTMLElement;
    let loader:HTMLElement=document.querySelector("#"+refDoc+index+" .spinner-border.spinner-border-sm") as HTMLElement;
    icon.style.display="none";
    loader.style.display="inline-block";
    
    }
  }
  openFileBrowser(id) {
    let element: HTMLElement = document.querySelector("#"+id) as HTMLElement;
    element.click();
  }
  getErrorInputs(key:string):string{
    if(!this.isInError){
      this.isInError=true;
      document.getElementById(key).scrollIntoView(true);
    }
    let errors = this.getFormGroup.get(key).errors;
    let s =  (Object.keys(errors)[0]+"Field");
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  getArtisticProfession(ar,lang){
    if(lang=="ar") return ar["nameAr"];
      return (ar["name"]);
  }
  getMaritalStatus(ar,lang){
    if(lang=="ar") return ar["labelAr"];
      return (ar["labelFr"]);
  }
  getIdentityType(ar,lang){
    if(lang=="ar") return ar["labelAr"];
      return (ar["labelFr"]);
  }
  getOption(option){
    if(option=="functionality")
      return this.functionalityValues;
    if(option=="settlement")
      return this.settlementValues;
    if(option=="identityType")
    {
      return this.identityTypeOption;
    }
    if(option=="maritalStatus")
    {
      return this.maritalStatusOption;
    }
    if(option == "gender"){
      return this.genderOption;
    }
    if(option == "lawForm"){
      return this.lawFormValues;
    }
    if(option=="countries")
      return this.countryValues;
    if(option=="commercialCourt")
      return this.commercialCourtValues;
    if(option=="activitySector")
      return this.sectoractivityValues;
    if(option=="isocertificates")
      return this.isocertificatesValues;
    if(option=="salesFamily")
      return this.salesfamilyValues;
    if(option == "regions")
      return this.regions; 
    if(option == "functions") 
      return this.managerfunctionsValues;
    if(option=="villes"&&this.supplierRequest.officeCountry=="Maroc")
      return this.villes;
    if(option=="villes1"&&this.settlement.country=="Maroc")
      return this.villes;
    return [];  
  }
  getModelValue(key){
    let keys = key.split(".");
    var d = this;
    for(var i =0;i<keys.length;i++)
        d=d[keys[i]];
    return d;
  }
  setDataWithObject(ob,data){
    for(let i of Object.keys(data))
    {
      this[ob][i]=data[i];
    }
  }
  
  onDone(){
    this.nextPage();
    
  }
  onError(error:any,flag:any){
    if(error.error.code=="AMC_EDITION_FOUND")
      this.noEdition=true;
    if(typeof flag == "function") flag();
  }
  AfterCheckLastPage(){
    if(!this.isLodedAllPage ){
      this.isLodedAllPage=true;
      this.isDisabled=false;
      this.isFormSubmitted=false;
    }
  }

  addCustomValue(item)
  {
    return item;
  }

  valideDemande()
  {
    this.isDisabled=true;
    this.authService.registerSupplier(this.supplierRequest).subscribe(
      res=>{
        Swal.fire(
          {
            position: 'center',
            title: this.translate.instant("success"),
            text: this.translate.instant("accountCreatedWithSuccess"),
            showConfirmButton: false,
            icon: 'success',
            timer:2000
          }
        ).then(()=>{
            this.router.navigate(["/auth/login"]);
        });
      },
      err=>{
        this.handleService.handleError(err);
      }
    ).add(()=>{
      this.isDisabled=false;
    })
  }
}
