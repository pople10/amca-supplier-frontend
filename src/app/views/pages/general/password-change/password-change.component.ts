import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import { ValidatorService } from 'src/app/services/shared/validator.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  passwordMessages: string[]=[];
  constructor(
    private matSnack:MatSnackBar,
    private validatorService:ValidatorService,
    private translateService:TranslateService,
    private handleRequest:HandleRequestService,
    private authService:AuthService,
    private router: Router, 
    public formBuilder: FormBuilder) { }

  validationEditForm:FormGroup;
  dataSent:boolean = false;
  submitted:boolean = false;

  updatePassword()
  {
      this.submitted=true;
      if(this.validationEditForm.valid)
      {
        if(this.validationEditForm.value?.newPassword!==this.validationEditForm.value?.newPasswordConfirmed)
        {
          this.matSnack.open(this.translateService.instant('confirmationPasswordRequired'), this.translateService.instant('close'));
          return;
        }
        this.dataSent=true;
        this.authService.updatePassword(this.validationEditForm.value).subscribe(response=>{
          this.handleRequest.successMessage(this.translateService.instant("done"));
        },err=>{this.handleRequest.handleError(err);})
        .add(()=>{this.dataSent=false;});
      }
  }


  ngOnInit(): void {
      this.validationEditForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required,Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
        newPasswordConfirmed: ['', [Validators.required]],
      });
  }

  get editForm() {
    return this.validationEditForm.controls;
  }

  onChangePassword(event){
    let data = this.validationEditForm.value?.newPassword;
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


}
