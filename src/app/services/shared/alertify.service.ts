import { Injectable } from '@angular/core';
import { LanguageService } from '../language/language.service';
declare let alertify:any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() {
    alertify.set('notifier','delay', 5);
}

decorator()
{
  if(localStorage.getItem("userLanguage")=="ar")
  {
    alertify.set('notifier','position', 'bottom-left');
  }
  else
  {
    alertify.set('notifier','position', 'bottom-right');
  }
}


confirm(message:string,okCallBack:()=>any){
  this.decorator();
  alertify.confirm(message,function(e){
    if(e){okCallBack()}else{}
  });
}

success(message :string){
  this.decorator();
  alertify.success(message);
}

error(message :string){
  this.decorator();
  alertify.error(message);
}
warning(message :string){
  this.decorator();
  alertify.warning(message);
}
message(message :string){
  this.decorator();
  alertify.message(message);
}

}
