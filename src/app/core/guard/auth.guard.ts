import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private authService:AuthService) {}

  private checkRoles(roles:string[],userRoles:string[])
  {
    for(let role of roles)
    {
        if(userRoles.filter((item)=>(item == role)).length > 0)
          return true;
    }
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const token_type = localStorage.getItem("token_type");
    const expirationDate = new Date(parseInt(localStorage.getItem("expiredAt")));
    if (localStorage.getItem('token') && expirationDate>new Date()) {
      let userData = JSON.parse(localStorage.getItem("userData"));
      if(this.checkRoles(route.children[0].data.role,userData.roles)){
        return true;
      }else{
        this.router.navigate(["/access-denied"]);
        return false;
      }
    }else{
      this.authService.logOut();
      return false;
    }
  }
}
