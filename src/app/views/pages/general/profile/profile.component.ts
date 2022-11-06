import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/shared/validator.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public domSanitizer: DomSanitizer,private matSnack:MatSnackBar,private validatorService:ValidatorService,private translateService:TranslateService,private handleRequest:HandleRequestService,private authService:AuthService,private router: Router, public formBuilder: FormBuilder) { }

  validationEditForm:FormGroup;
  userData;
  showModifyForm = false;
  dataSent:boolean = false;
  submitted:boolean = false;
  uploading:boolean = false;

  updateProfile()
  {
      this.submitted=true;
      if(this.validationEditForm.valid)
      {
        this.dataSent=true;
        this.authService.updateProfile(this.validationEditForm.value).subscribe(response=>{
          this.refresh(response);
          this.toggleShowModifyForm();
          this.handleRequest.successMessage(this.translateService.instant("done"));
        },err=>{this.handleRequest.handleError(err);})
        .add(()=>{this.dataSent=false;});
      }
  }

  refresh(response)
  {
    this.authService.updateData(response);
    this.userData = JSON.parse(localStorage.getItem("userData"));
  }


  onUploadPhoto(event)
  {
    let file = event.target.files[0];
    if(!this.validatorService.isFileImage(file))
    {
      this.matSnack.open(this.translateService.instant('invalid_photo_type'), this.translateService.instant('close'));
      return;
    }
    this.uploading=true;
    this.authService.updatePhoto(file).subscribe((response)=>{
      this.refresh({img:response});
    },err=>{this.handleRequest.handleError(err)})
    .add(()=>{this.uploading=false;});
  }

  ngOnInit(): void {

    if(localStorage.getItem("userData") != null){
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.validationEditForm = this.formBuilder.group({
        lastname: [this.userData?.lastname, Validators.required],
        firstname: [this.userData?.firstname, Validators.required],
        email: [this.userData.user, [Validators.required,Validators.email]],
      });
    }else{
      this.authService.logOut();
    }
  }

  get editForm() {
    return this.validationEditForm.controls;
  }

  toggleShowModifyForm(){
    this.showModifyForm = !this.showModifyForm;
  }

}
