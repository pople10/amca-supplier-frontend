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

@Component({
  selector: 'app-supplier-register',
  templateUrl: './supplier-register.component.html',
  styleUrls: ['./supplier-register.component.scss']
})
export class SupplierRegisterComponent implements OnInit {

  /*****    flags for update any item     *****/
  refToUpdate:string=null;

  /*****    Fome Group for validation     *****/
  validationForm1: FormGroup;
  validationFormFiles:FormGroup;
  validationForm3: FormGroup;

  /*****    Submit Data     *****/
  artistAccount:any;
  generalMember:any={};
  generalMemberArray:Array<any>=[];
  page:any=1;
  lastPage:any=4;
  isFormSubmitted: Boolean;

  /*****   Inputs : Generation in HTML by *ngFor    *****/
  inputsStep1;
  inputsStep2:Array<any>;
  inputsStep3;

  /*****   Flags    *****/
  isDisabled:Boolean=false;
  isModification:Boolean=false;
  isLoded:Boolean=false;
  isInError:Boolean=false;
  isLodedAllPage:Boolean=false;
  iseditablePage2:Boolean=false;
  isdisableLoadModal:Boolean=true;
  noEdition:Boolean=false;
  artisticProfession:any;
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
  DataPage1 = ["cin","firstName","lastName","firstNameAR","lastNameAR","artistName","artistNameAR","gender","identityType","identityNumber","identityProfType","artistSpeciality","artistSpecialityAR","email","phoneNumber","otherPhoneNumber","maritalStatus","dependentChildren","otherJobName","socialSecurityName","socialSecurityID","artisticWorkStartDate","lastArtisticActivity","teamName","teamCreationDate","studyLevel","artisticEtablishmentName","ribNumber","domainName","birthDate","birthCountry","birthCity","nationality"
  ,"region","city","postalCode","address","province","projectName","projectTitle","projectType","numDancesOrSongs","durationTime","projectCost","projectDescription","albumTitle","refArtisticProfession"];//
  Files = ["TECHNICAL_FORM","ESTIMATED_PRICE","RESUME","ARTISTIC_FOLDER","ARTISTIC_CARD","WORK_PROFESSIONAL_PHOTO","CIN_CARD_COPY_ARTIST"];
  MemberData = ["cin","firstName","lastName","gender","phoneNumber","email","role"];

  initForme1(){
    this.inputsStep1 = [
      {type:"simpleInput",data:{formControlName:"cin",label:"cin",placeHolder:"",type:"text",ngModel:this.artistAccount.cin,onChange:(v)=>{this.onChangevalue(v,'artistAccount','cin')},required:true}},
      {type:"simpleInput",data:{formControlName:"firstName",label:"firstName",placeHolder:"",type:"text",ngModel:this.artistAccount.firstName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','firstName')},required:true}},
      {type:"simpleInput",data:{formControlName:"lastName",label:"lastName",placeHolder:"",type:"text",ngModel:this.artistAccount.lastName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','lastName')},required:true}},
      {type:"simpleInput",data:{formControlName:"firstNameAR",label:"firstNameAR",placeHolder:"",type:"text",ngModel:this.artistAccount.firstNameAR,onChange:(v)=>{this.onChangevalue(v,'artistAccount','firstNameAR')},required:true}},
      {type:"simpleInput",data:{formControlName:"lastNameAR",label:"lastNameAR",placeHolder:"",type:"text",ngModel:this.artistAccount.lastNameAR,onChange:(v)=>{this.onChangevalue(v,'artistAccount','lastNameAR')},required:true}},
      {type:"simpleInput",data:{formControlName:"artistName",label:"artistName",placeHolder:"",type:"text",ngModel:this.artistAccount.artistName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','artistName')},required:true}},
      {type:"simpleInput",data:{formControlName:"artistNameAR",label:"artistNameAR",placeHolder:"",type:"text",ngModel:this.artistAccount.artistNameAR,onChange:(v)=>{this.onChangevalue(v,'artistAccount','artistNameAR')},required:true}},
      {type:"selectInput",data:{formControlName:"gender",label:"gender",placeHolder:"",type:"text",ngModel:'artistAccount.gender',onChange:(v)=>{this.onChangevalue(v,'artistAccount','gender')},required:true,options:'gender',value:'id',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"selectInput",data:{formControlName:"identityType",label:"identityType",placeHolder:"",type:"text",ngModel:'artistAccount.identityType',onChange:(v)=>{this.onChangevalue(v,'artistAccount','identityType')},required:true,options:'identityType',value:'value',labelS:'identityType',getLabel:this.getIdentityType,multiple:false}},
      {type:"simpleInput",data:{formControlName:"identityNumber",label:"identityNumber",placeHolder:"",type:"text",ngModel:this.artistAccount.identityNumber,onChange:(v)=>{this.onChangevalue(v,'artistAccount','identityNumber')},required:true}},
      {type:"simpleInput",data:{formControlName:"identityProfType",label:"identityProfType",placeHolder:"",type:"text",ngModel:this.artistAccount.identityProfType,onChange:(v)=>{this.onChangevalue(v,'artistAccount','identityProfType')},required:true}},
      {type:"simpleInput",data:{formControlName:"artistSpeciality",label:"artistSpeciality",placeHolder:"",type:"text",ngModel:this.artistAccount.artistSpeciality,onChange:(v)=>{this.onChangevalue(v,'artistAccount','artistSpeciality')},required:true}},
      {type:"simpleInput",data:{formControlName:"artistSpecialityAR",label:"artistSpecialityAR",placeHolder:"",type:"text",ngModel:this.artistAccount.artistSpecialityAR,onChange:(v)=>{this.onChangevalue(v,'artistAccount','artistSpecialityAR')},required:true}},
      {type:"simpleInput",data:{formControlName:"email",label:"email",placeHolder:"",type:"text",ngModel:this.artistAccount.email,onChange:(v)=>{this.onChangevalue(v,'artistAccount','email')},required:true}},
      {type:"simpleInput",data:{formControlName:"phoneNumber",label:"phoneNumber",placeHolder:"",type:"text",ngModel:this.artistAccount.phoneNumber,onChange:(v)=>{this.onChangevalue(v,'artistAccount','phoneNumber')},required:true}},
      {type:"simpleInput",data:{formControlName:"otherPhoneNumber",label:"otherPhoneNumber",placeHolder:"",type:"text",ngModel:this.artistAccount.otherPhoneNumber,onChange:(v)=>{this.onChangevalue(v,'artistAccount','otherPhoneNumber')},required:true}},
      {type:"selectInput",data:{formControlName:"maritalStatus",label:"maritalStatus",placeHolder:"",type:"text",ngModel:'artistAccount.maritalStatus',onChange:(v)=>{this.onChangevalue(v,'artistAccount','maritalStatus')},required:true,options:'maritalStatus',value:'value',labelS:'maritalStatus',getLabel:this.getMaritalStatus,multiple:false}},
      {type:"simpleInput",data:{formControlName:"dependentChildren",label:"dependentChildren",placeHolder:"",type:"number",ngModel:this.artistAccount.dependentChildren,onChange:(v)=>{this.onChangevalue(v,'artistAccount','dependentChildren')},required:true}},
      {type:"simpleInput",data:{formControlName:"otherJobName",label:"otherJobName",placeHolder:"",type:"text",ngModel:this.artistAccount.otherJobName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','otherJobName')},required:true}},
      {type:"simpleInput",data:{formControlName:"socialSecurityName",label:"socialSecurityName",placeHolder:"",type:"text",ngModel:this.artistAccount.socialSecurityName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','socialSecurityName')},required:true}},
      {type:"simpleInput",data:{formControlName:"socialSecurityID",label:"socialSecurityID",placeHolder:"",type:"text",ngModel:this.artistAccount.socialSecurityID,onChange:(v)=>{this.onChangevalue(v,'artistAccount','socialSecurityID')},required:true}},
      {type:"simpleInput",data:{formControlName:"artisticWorkStartDate",label:"artisticWorkStartDate",placeHolder:"",type:"date",ngModel:this.artistAccount.artisticWorkStartDate,onChange:(v)=>{this.onChangevalue(v,'artistAccount','artisticWorkStartDate')},required:true}},
      {type:"simpleInput",data:{formControlName:"lastArtisticActivity",label:"lastArtisticActivity",placeHolder:"",type:"text",ngModel:this.artistAccount.lastArtisticActivity,onChange:(v)=>{this.onChangevalue(v,'artistAccount','lastArtisticActivity')},required:true}},
      {type:"simpleInput",data:{formControlName:"teamName",label:"teamName",placeHolder:"",type:"text",ngModel:this.artistAccount.teamName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','teamName')},required:true}},
      {type:"simpleInput",data:{formControlName:"teamCreationDate",label:"teamCreationDate",placeHolder:"",type:"date",ngModel:this.artistAccount.teamCreationDate,onChange:(v)=>{this.onChangevalue(v,'artistAccount','teamCreationDate')},required:true}},
      {type:"simpleInput",data:{formControlName:"studyLevel",label:"studyLevel",placeHolder:"",type:"text",ngModel:this.artistAccount.studyLevel,onChange:(v)=>{this.onChangevalue(v,'artistAccount','studyLevel')},required:true}},
      {type:"simpleInput",data:{formControlName:"artisticEtablishmentName",label:"artisticEtablishmentName",placeHolder:"",type:"text",ngModel:this.artistAccount.artisticEtablishmentName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','artisticEtablishmentName')},required:true}},
      {type:"simpleInput",data:{formControlName:"ribNumber",label:"ribNumber",placeHolder:"",type:"text",ngModel:this.artistAccount.ribNumber,onChange:(v)=>{this.onChangevalue(v,'artistAccount','ribNumber')},required:true}},
      {type:"simpleInput",data:{formControlName:"domainName",label:"domainName",placeHolder:"",type:"text",ngModel:this.artistAccount.domainName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','domainName')},required:true}},
      {type:"simpleInput",data:{formControlName:"birthDate",label:"birthDate",placeHolder:"",type:"date",ngModel:this.artistAccount.birthdata.birthDate,onChange:(v)=>{this.onChangevalue(v,'artistAccount','birthdata.birthDate')},required:true}},
      {type:"simpleInput",data:{formControlName:"birthCountry",label:"birthCountry",placeHolder:"",type:"text",ngModel:this.artistAccount.birthdata.birthCountry,onChange:(v)=>{this.onChangevalue(v,'artistAccount','birthdata.birthCountry')},required:true}},
      {type:"simpleInput",data:{formControlName:"birthCity",label:"birthCity",placeHolder:"",type:"text",ngModel:this.artistAccount.birthdata.birthCity,onChange:(v)=>{this.onChangevalue(v,'artistAccount','birthdata.birthCity')},required:true}},
      {type:"simpleInput",data:{formControlName:"nationality",label:"nationality",placeHolder:"",type:"text",ngModel:this.artistAccount.birthdata.nationality,onChange:(v)=>{this.onChangevalue(v,'artistAccount','birthdata.nationality')},required:true}},
      
      {type:"selectInput",data:{formControlName:"region",label:"region",placeHolder:"",ngModel:'artistAccount.address.region',onChange:(v)=>{this.onChangeRegion(v)},required:true,options:'regions',value:'id',labelS:'region',getLabel:(r)=>{return r.region;},multiple:false}},
      {type:"selectInput",data:{formControlName:"city",label:"city",placeHolder:"",ngModel:'artistAccount.address.city',onChange:(v)=>{this.onChangeVille(v)},required:true,options:'villes',value:'id',labelS:'ville',getLabel:(r)=>{return r.ville;},multiple:false}},
      {type:"simpleInput",data:{formControlName:"postalCode",label:"postalCode",placeHolder:"",type:"text",ngModel:this.artistAccount.address.postalCode,onChange:(v)=>{this.onChangevalue(v,'artistAccount','address.postalCode')},required:true}},
      {type:"simpleInput",data:{formControlName:"address",label:"address",placeHolder:"",type:"text",ngModel:this.artistAccount.address.address,onChange:(v)=>{this.onChangevalue(v,'artistAccount','address.address')},required:true}},
      {type:"simpleInput",data:{formControlName:"province",label:"province",placeHolder:"",type:"text",ngModel:this.artistAccount.address.province,onChange:(v)=>{this.onChangevalue(v,'artistAccount','address.province')},required:false}},
      
      {type:"selectInput",data:{formControlName:"refArtisticProfession",label:"refArtisticProfession",placeHolder:"",ngModel:'artistAccount.refArtisticProfession',onChange:(v)=>{this.onChangevalue(v,'artistAccount','refArtisticProfession')},required:true,options:'artisticProfession',value:'refArtisticProfession',labelS:'artisticProfession',getLabel:this.getArtisticProfession,multiple:false}},
      {type:"titleElement",title:"generalInfo",data:{formControlName:'generalInfo'}},
      {type:"simpleInput",data:{formControlName:"projectName",label:"projectName",placeHolder:"",type:"text",ngModel:this.artistAccount.generalInformation.projectName,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.projectName')},required:true}},
      {type:"simpleInput",data:{formControlName:"projectTitle",label:"projectTitle",placeHolder:"",type:"text",ngModel:this.artistAccount.generalInformation.projectTitle,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.projectTitle')},required:true}},
      {type:"simpleInput",data:{formControlName:"projectType",label:"projectType",placeHolder:"",type:"text",ngModel:this.artistAccount.generalInformation.projectType,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.projectType')},required:true}},
      {type:"simpleInput",data:{formControlName:"numDancesOrSongs",label:"numDancesOrSongs",placeHolder:"",type:"number",ngModel:this.artistAccount.generalInformation.numDancesOrSongs,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.numDancesOrSongs')},required:true}},
      {type:"simpleInput",data:{formControlName:"durationTime",label:"durationTime",placeHolder:"",type:"number",ngModel:this.artistAccount.generalInformation.durationTime,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.durationTime')},required:true}},
      {type:"simpleInput",data:{formControlName:"projectCost",label:"projectCost",placeHolder:"",type:"number",ngModel:this.artistAccount.generalInformation.projectCost,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.projectCost')},required:true}},
      {type:"simpleInput",data:{formControlName:"projectDescription",label:"projectDescription",placeHolder:"",type:"text",ngModel:this.artistAccount.generalInformation.projectDescription,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.projectDescription')},required:true}},
      {type:"simpleInput",data:{formControlName:"albumTitle",label:"albumTitle",placeHolder:"",type:"text",ngModel:this.artistAccount.generalInformation.albumTitle,onChange:(v)=>{this.onChangevalue(v,'artistAccount','generalInformation.albumTitle')},required:true}},
     ];
  }
  initinputsStep2= ()=>{    
    this.inputsStep2=[];
    let data =[];
    for(let k of this.Files){
      this.inputsStep2.push({file:null,documentType:k,key:k,data:{name:"",refDocument:""},accept:"image/jpeg,image/jpg,image/png,application/pdf",required:true});
      data[k]=[null, Validators.required];
    }
    this.validationFormFiles = this.formBuilder.group({...data});
  }
  initForme3= ()=>{    
    this.inputsStep3 = [
      {type:"simpleInput",data:{formControlName:"firstName",label:"firstName",placeHolder:"",type:"text",ngModel:this.generalMember.firstName,onChange:(v)=>{this.onChangevalue(v,'generalMember','firstName')},required:true}},
      {type:"simpleInput",data:{formControlName:"lastName",label:"lastName",placeHolder:"",type:"text",ngModel:this.generalMember.lastName,onChange:(v)=>{this.onChangevalue(v,'generalMember','lastName')},required:true}},
      {type:"simpleInput",data:{formControlName:"email",label:"email",placeHolder:"",type:"text",ngModel:this.generalMember.email,onChange:(v)=>{this.onChangevalue(v,'generalMember','email')},required:true}},
      {type:"simpleInput",data:{formControlName:"cin",label:"cin",placeHolder:"",type:"text",ngModel:this.generalMember.cin,onChange:(v)=>{this.onChangevalue(v,'generalMember','cin')},required:true}},
      {type:"selectInput",data:{formControlName:"gender",label:"gender",placeHolder:"",ngModel:'generalMember.gender',onChange:(v)=>{this.onChangevalue(v,'generalMember','gender')},required:true,options:'gender',value:'id',labelS:'label',getLabel:(r)=>{return r.label;},multiple:false}},
      {type:"phoneNumber",data:{formControlName:"phoneNumber",label:"phoneNumber",placeHolder:"",type:"text",ngModel:this.generalMember.phoneNumber,onChange:(v)=>{this.onChangevalue(v,'generalMember','phoneNumber')},required:true}},
      {type:"simpleInput",data:{formControlName:"role",label:"role",placeHolder:"",type:"text",ngModel:this.generalMember.role,onChange:(v)=>{this.onChangevalue(v,'generalMember','role')},required:true}},
    ];
  }
  get getFormGroup(){
    switch (this.page) {
      case 1:
        return this.validationForm1;
      case 2:
        return this.validationFormFiles;
      case 3:
        return this.validationForm3;
      case 4:
          return this.validationForm3;
      default:
        break;
    }
  }
  get form(){
    return this.getFormGroup.controls;
  }
  constructor(  private route: ActivatedRoute,public formBuilder: FormBuilder,private translate: TranslateService,private router:Router,private modalService: NgbModal, private authService: AuthService,public  languageService: LanguageService,private snackBar:MatSnackBar,) {
    this.isLoded=true;
    this.isLodedAllPage=true;
    this.initinputsStep2();
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
    Validation1AllElement["province"]=['', Validators.nullValidator];
    Validation1AllElement["email"]=['', [Validators.required, Validators.email]];
    this.validationForm1 = this.formBuilder.group({...Validation1AllElement});
    Validation1AllElement={};
    for(let el of this.MemberData)
      Validation1AllElement[el]=['', Validators.required];
    Validation1AllElement["email"]=['', [Validators.required, Validators.email]];
    this.validationForm3 = this.formBuilder.group({...Validation1AllElement});
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
      default:
        return null;
    }
  }
  onSubmitPage1 = ()=>{
    if(this.validationForm1.valid){
      
    }
    else {
      this.isDisabled=false;
      this.AfterCheckLastPage();
    }
  }
  onSubmitPage2 = ()=>{
    
  }    
  onSubmitPage3 = ()=>{
    
  }
  onSubmitPage4 = ()=>{
    if(!this.isLodedAllPage){
          this.onDone();
          this.AfterCheckLastPage();
    }
  }
  
  
  onAddForm3(e){
    
  }
  
  
  onInitPage1(){
    
  }
  onInitPage3(){
    
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
    if(value==null || value=="") return;
    this.villes=VILLES.filter(ville=>ville.region==value);
    this.artistAccount.address.region=value;
    let city=this.artistAccount.address.city;
    if(city!=null)
      if((this.villes.filter(v=>v.id==city)).length==0)
        this.artistAccount.address.city=null;
  }
  onChangeVille = (value)=>{
    if(value==null || value=="") return;
    this.artistAccount.address.city=value;
    this.onChangeRegion((VILLES.filter(ville=>ville.id==value))[0].region);
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
    if(option == "artisticProfession"){
      return this.artisticProfession;
    }
    if(option == "regions")
      return this.regions;  
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
    if(this.page==1){
      if(this.isLodedAllPage)
          Swal.fire(
            {
              position: 'center',
              title: this.translate.instant("table_add_done"),
              text: '',
              showConfirmButton: false,
              timer: 2000,
              icon: 'success'
            }
          )
          .then(()=>{this.nextPage()})
      else this.nextPage();
    }
    
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
}
