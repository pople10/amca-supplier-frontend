import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  returnUrl: any;

  showSpinner = false;

  loginForm = new FormGroup({
    username: new FormControl('',
    [

      Validators.required,
      Validators.minLength(4),
    ]),
    password: new FormControl(
    '',
    [
      Validators.required,
      Validators.minLength(4),
    ]),
  });
  constructor(private router: Router, private route: ActivatedRoute, private authService:AuthService, private snackBar: MatSnackBar, public languageService: LanguageService,private handleRequestService:HandleRequestService,private translate:TranslateService) { }


  changeLanguage(language){
    this.languageService.setLanguage(language);
  }

  getCurrentLanguage(){
    return localStorage.getItem("userLanguage") ?? "fr";
  }

  ngOnInit(): void {
    try{
      (async function(){
        await this.translate.get('proposalActivityEmpty').toPromise().then();
      });
    }catch(e)
    {

    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    if(this.authService.isLoggedIn())
    {
      this.router.navigate([this.returnUrl]);
      return;
    }
      this.authService.logOut();
  }

  loginFalseSnack() {
    this.snackBar.open("Mauvais email ou mot de passe", "fermer");
  }

  loginFailSnack() {
    this.snackBar.open("Une erreur s'est produit au niveau du serveur", "fermer");
  }

  loginFormEmptySnack() {
    this.snackBar.open("Veuillez remplir touts les champs", "fermer");
  }
  onLoggedin(e) {
    e.preventDefault();
    if(this.loginForm.value.email != '' && this.loginForm.value.password != ''){
      this.showSpinner = true;
      this.authService.login(this.loginForm.value).subscribe((res)=>{
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("token_type",res.token_type);
        localStorage.setItem('expiredAt', ""+(new Date().getTime()+res.expires_in*1000));
        localStorage.setItem('userData', JSON.stringify({"email":res.username,"roles" : res.roles.map(d=>d.toLowerCase())}));
        if (localStorage.getItem('token')) {
          this.router.navigate([this.returnUrl]);
        }
      },
      (err)=>{
        this.handleRequestService.handleError(err);
      }).add(()=>{
        this.showSpinner = false;
      });
    }else{
      this.loginFormEmptySnack();
    }
    
  }

  goBack(e)
  {
    e.preventDefault();
    window.location.href="/";
  }

}
