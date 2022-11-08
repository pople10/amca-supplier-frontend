import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService } from 'src/app/services/language/language.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { REGIONS } from 'src/app/lists/regions';
import { VILLES } from 'src/app/lists/villes';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GeneralService } from 'src/app/services/shared/general.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import { SupplierRequest } from 'src/app/entities/SupplierRequest';

@Component({
  selector: 'app-supplier-register',
  templateUrl: './supplier-register.component.html',
  styleUrls: ['./supplier-register.component.scss']
})
export class SupplierRegisterComponent implements OnInit {
  onSubmitPage6() {
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

  /*****    Submit Data     *****/
  supplierRequest:SupplierRequest=new SupplierRequest();
  page:any=1;
  lastPage:any=6;
  isFormSubmitted: Boolean;

  /*****   Inputs : Generation in HTML by *ngFor    *****/
  inputsStep1;
  inputsStep2:Array<any>;
  inputsStep3;
  inputsStep4;
  inputsStep5;
  /*********** Values ****** */
  lawFormValues:any;
  commercialCourtValues:any;
  salesfamilyValues:any;
  managerfunctionsValues:any;
  countryValues:any;
  sectoractivityValues:any;

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
  regions = REGIONS;
  villes =VILLES;
  genderOption = [{id:'H',label:'Homme'},{id:'F',label:'Femme'}];
  roleOption = [{id:"1",label:'Role 1'},{id:"2",label:'Role 2'}];
  maritalStatusOption=[{value:"MARRIED",labelFr:"Marié(e)",labelAr:"(ة)متزوج"},
                        {value:"SINGLE",labelFr:"Célibataire(e)",labelAr:"(ة)أعزب"},
                        {value:"DIVORCED",labelFr:"Divorcé(e)",labelAr:"(ة)مطلق"}];
  identityTypeOption=[{value:"CIN_CARD",labelFr:"Carte d'identité nationale",labelAr:"بطاقة التعريف الوطنية"},
                      {value:"PASSPORT",labelFr:"Passeport",labelAr:"جواز سفر"},
                      {value:"DRIVER_LICENSE_CARD",labelFr:"Permis de conduire",labelAr:"بطاقة رخصة السائق"},
                      {value:"RESIDENT_CARD",labelFr:"Carte de séjour",labelAr:"بطاقة اقامة"}]                      
  DataPage1 = ["firstName","lastName","cin","email","phone","password"];//
  DataPage2 = ["socialReason","tradeName","lawForm","nrc","commercialCourt","creationYear","ice","capitalMAD"];
  DataPage3 = ["officeAddress","officeZipCode","officeCountry","officeCity","xAxisMap","yAxisMap"];
  DataPage4 = ["managerFullName","managerFunction","professionalFax","professionalPhone","professionalEmail","website"]
  DataPage5 = ["activitySector","totalEffective","turnoverN1","turnoverN2","turnoverN3","isoCertification","otherIsoCertification","salesFamily"];
  DataPages= [this.DataPage1,this.DataPage2,this.DataPage3]
  Files = [];
  MemberData = ["cin","firstName","lastName","gender","phoneNumber","email","role"];

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
      {type:"selectInput",data:{formControlName:"lawForm",label:"lawForm",placeHolder:"",type:"text",ngModel:'supplierRequest.lawForm',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','lawForm')},required:true,options:'lawForm',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"simpleInput",data:{formControlName:"nrc",label:"nrc",placeHolder:"",type:"number",ngModel:this.supplierRequest.nrc,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','nrc')},required:false}},
      {type:"selectInput",data:{formControlName:"commercialCourt",label:"commercialCourt",placeHolder:"",type:"text",ngModel:'supplierRequest.commercialCourt',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','commercialCourt')},required:false,options:'commercialCourt',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"simpleInput",data:{formControlName:"creationYear",label:"creationYear",placeHolder:"",type:"number",ngModel:this.supplierRequest.creationYear,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','creationYear')},required:true}},
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
      {type:"simpleInput",data:{formControlName:"officeCity",label:"officeCity",placeHolder:"",type:"text",ngModel:this.supplierRequest.officeCity,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','officeCity')},required:true}},
      {type:"simpleInput",data:{formControlName:"xAxisMap",label:"xAxisMap",placeHolder:"",type:"text",ngModel:this.supplierRequest.xAxisMap,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','xAxisMap')},required:true}},
      {type:"simpleInput",data:{formControlName:"yAxisMap",label:"yAxisMap",placeHolder:"",type:"text",ngModel:this.supplierRequest.yAxisMap,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','yAxisMap')},required:true}},
    ];
  }
  initForme4= ()=>{    
    this.inputsStep4 = [
      {type:"simpleInput",data:{formControlName:"managerFullName",label:"managerFullName",placeHolder:"",type:"text",ngModel:this.supplierRequest.managerFullName,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','managerFullName')},required:true}},
      {type:"selectInput",data:{formControlName:"managerFunction",label:"managerFunction",placeHolder:"",type:"text",ngModel:'supplierRequest.managerFunction',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','managerFunction')},required:true,options:'functions',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"phoneNumber",data:{formControlName:"professionalFax",label:"professionalFax",placeHolder:"",type:"text",ngModel:this.supplierRequest.professionalFax,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','professionalFax')},required:true}},
      {type:"phoneNumber",data:{formControlName:"professionalPhone",label:"professionalPhone",placeHolder:"",type:"tel",ngModel:this.supplierRequest.professionalPhone,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','professionalPhone')},required:true}},
      {type:"simpleInput",data:{formControlName:"professionalEmail",label:"professionalEmail",placeHolder:"",type:"text",ngModel:this.supplierRequest.professionalEmail,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','professionalEmail')},required:true}},
      {type:"simpleInput",data:{formControlName:"website",label:"website",placeHolder:"",type:"text",ngModel:this.supplierRequest.website,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','website')},required:true}},
    ];
  }
  initForme5= ()=>{    
    this.inputsStep5 = [
      {type:"selectInput",data:{formControlName:"activitySector",label:"activitySector",placeHolder:"",type:"text",ngModel:'supplierRequest.activitySector',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','activitySector')},required:true,options:'activitySector',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"simpleInput",data:{formControlName:"totalEffective",label:"totalEffective",placeHolder:"",type:"number",ngModel:this.supplierRequest.totalEffective,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','totalEffective')},required:true}},
      {type:"simpleInput",data:{formControlName:"turnoverN1",label:"turnoverN1",placeHolder:"",type:"number",ngModel:this.supplierRequest.turnoverN1,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','turnoverN1')},required:true}},
      {type:"simpleInput",data:{formControlName:"turnoverN2",label:"turnoverN2",placeHolder:"",type:"number",ngModel:this.supplierRequest.turnoverN2,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','turnoverN2')},required:true}},
      {type:"simpleInput",data:{formControlName:"turnoverN3",label:"turnoverN3",placeHolder:"",type:"number",ngModel:this.supplierRequest.turnoverN3,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','turnoverN3')},required:true}},
      {type:"simpleInput",data:{formControlName:"isoCertification",label:"isoCertification",placeHolder:"",type:"text",ngModel:this.supplierRequest.isoCertification,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','isoCertification')},required:true}},
      {type:"simpleInput",data:{formControlName:"otherIsoCertification",label:"otherIsoCertification",placeHolder:"",type:"text",ngModel:this.supplierRequest.otherIsoCertification,onChange:(v)=>{this.onChangevalue(v,'supplierRequest','otherIsoCertification')},required:true}},
      {type:"selectInput",data:{formControlName:"salesFamily",label:"salesFamily",placeHolder:"",type:"text",ngModel:'supplierRequest.salesFamily',onChange:(v)=>{this.onChangevalue(v,'supplierRequest','salesFamily')},required:true,options:'salesFamily',value:'value',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
    ];
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
        return this.validationForm5;
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
      this.sectoractivityValues=res.filter(e=>(e.name=="sectoractivity"))[0].data;;
    },err=>{
      this.handleService.handleError(err);
    })
    this.initFormValidator();
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
    var Validation1AllElement={};
    for(let el of this.DataPage1)
      Validation1AllElement[el]=['', Validators.required];
    Validation1AllElement["email"]=['', [Validators.required, Validators.email]];
    this.validationForm1 = this.formBuilder.group({...Validation1AllElement});
    Validation1AllElement={};
      for(let el of this.DataPage2)
        Validation1AllElement[el]=['', Validators.required];
    this.validationForm2= this.formBuilder.group({...Validation1AllElement});
    Validation1AllElement={};
      for(let el of this.DataPage3)
        Validation1AllElement[el]=['', Validators.required];
    this.validationForm3= this.formBuilder.group({...Validation1AllElement});
    Validation1AllElement={};
      for(let el of this.DataPage4)
        Validation1AllElement[el]=['', Validators.required];
      Validation1AllElement["professionalEmail"]=['', [Validators.required, Validators.email]];
    this.validationForm4= this.formBuilder.group({...Validation1AllElement});
    Validation1AllElement={};
      for(let el of this.DataPage5)
        Validation1AllElement[el]=['', Validators.required];
    this.validationForm5= this.formBuilder.group({...Validation1AllElement});
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
    if(option=="salesFamily")
      return this.salesfamilyValues;
    if(option == "regions")
      return this.regions; 
    if(option == "functions") 
      return this.managerfunctionsValues;
    return this.villes;  
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
