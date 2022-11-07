import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/services/language/language.service';
import { RegisterModel } from 'src/app/entities/auth/register-model';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  data:RegisterModel = new RegisterModel();
  passwordMessages:string[]=[];
  display:string="CIN";
  showCin=false;
  accountTypes:any[]=
  [{
    id:"PERSON",
    labelFr:"Personne",
    labelAr:"شخص"
  },{
    id:"COMPANY",
    labelFr:"Entreprise",
    labelAr:"شركة"
  },
  {
    id:"COOPERATIVE",
    labelFr:"Cooperative",
    labelAr:"تعاونية"
  }];

  typeChanged(event)
  {
    if(event=="PERSON")
    {
      this.display="CIN";
      this.showCin=true;
    }
    else if(event=="COMPANY"){
      this.display="numCompany";
      this.showCin=true;
    }
    else if(event=="COOPERATIVE"){
      this.display="numCooperative";
      this.showCin=true;
    }
    else
    {
      this.display="CIN";
      this.showCin=false;
    }

  }

  constructor(private router: Router,private translateService:TranslateService,public languageService: LanguageService, private authService : AuthService, private handleRequestService:HandleRequestService) { }

  onChangePassword(event){
    let data = this.data.password;
    this.passwordMessages=[];
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

  ngOnInit(): void {
    
  }

  onRegister(e) {
    e.preventDefault();
    this.isSubmitted=true;
    this.dataSent=true;
    if(this.registerForm.valid)
    {
        this.authService.register(this.data).subscribe(response=>{
          this.data.clear();
          this.isSubmitted=false;
          Swal.fire(
            {
              position: 'center',
              title: this.translateService.instant("success"),
              text: this.translateService.instant("accountCreatedWithSuccess"),
              showConfirmButton: false,
              icon: 'success',
              timer:2000
            }
          ).then(()=>{
              this.router.navigate(["/auth/login"]);
          });
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

  goBack(e)
  {
    e.preventDefault();
    window.location.href="http://siel.ma/";
  }
}
