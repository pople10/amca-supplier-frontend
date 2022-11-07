import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  showSpinner:boolean=false;
  isSubmitted:boolean=false;
  vkey:string=null;
  email:string="";
  password:string="";
  passwordMessages:string[]=[];
  confirmedPassword:boolean=true;

  resetForm = new FormGroup({
    email: new FormControl('',
    [

      Validators.required,
      Validators.email,
    ])
  });

  changeForm = new FormGroup({
    password: new FormControl('',
    [

      Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
    ]),
    passwordConfirmation: new FormControl('',
    [

      Validators.required
    ]),
  });

  onChangePassword(event){
    let data = this.password;
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

  constructor(private router: Router, private route: ActivatedRoute, private authService:AuthService, private snackBar: MatSnackBar, public languageService: LanguageService,private handleRequestService:HandleRequestService,private translateService:TranslateService) { }

  ngOnInit(): void {
    this.vkey=this.route.snapshot.paramMap.get('vkey');
  }

  reset(event)
  {
    
    event.preventDefault();
    this.isSubmitted=true;
    if(this.resetForm.valid)
    {
      this.showSpinner=true;
      let data = {
        "email" : this.email,
        "redirectTo" :location.href
      };
      this.authService.askToReset(data).subscribe(response=>{
        Swal.fire(
          {
            position: 'center',
            title: this.translateService.instant("success"),
            text: this.translateService.instant("resetSent"),
            showConfirmButton: false,
            icon: 'success'
          }
        );
      },err=>{
        this.handleRequestService.handleError(err);
      }).add(()=>{
          this.showSpinner=false;
      });
    }
  }

  change(event)
  {
    
    event.preventDefault();
    this.isSubmitted=true;
    if(this.password==this.formchange.passwordConfirmation.value||this.formchange.passwordConfirmation.value=="")
      this.confirmedPassword=true;
    else
      this.confirmedPassword=false;
    if(this.changeForm.valid&&this.confirmedPassword)
    {
      this.showSpinner=true;
      let data = {
        "vkey" : this.vkey,
        "password" :this.password
      };
      this.authService.reset(data).subscribe(response=>{
        Swal.fire(
          {
            position: 'center',
            title: this.translateService.instant("success"),
            text: this.translateService.instant("resetDone"),
            showConfirmButton: false,
            icon: 'success',
            timer:3000
          }
        ).then(()=>{
          this.router.navigate(["/auth/login"]);
        });
      },err=>{
        this.handleRequestService.handleError(err);
      }).add(()=>{
          this.showSpinner=false;
      });
    }
  }

  goBack(e)
  {
    e.preventDefault();
  }

  get form()
  {
    return this.resetForm.controls;
  }

  get formchange()
  {
    return this.changeForm.controls;
  }
}
