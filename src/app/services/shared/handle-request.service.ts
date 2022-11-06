import { Injectable , Injector } from '@angular/core';
import { ValidatorService } from './validator.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HandleRequestService {

  constructor(private validator:ValidatorService,private translate:TranslateService) { 
    try{
      (async function(){
        await this.translate.get('proposalActivityEmpty').toPromise().then();
      })
    }catch(e)
    {

    }
  }

  private argsFormat(args:string[])
  {
    let out="";
    for(let s of args)
    {
      out+=s+"\n";
    }
    return out; 
  }

  handleError(error)
  {
      if(!this.validator.checkIfHasArguments(error,["error"]))
        return;
      if(this.checkIfBuilt(error.error))
      {
        if(this.checkIfHasArgument(error.error))
        {
            Swal.fire(
              {
                position: 'center',
                title: this.translate.instant("error"),
                text: error.error.message,
                showConfirmButton: true,
                confirmButtonText:this.translate.instant("ok"),
                icon: 'error'
              }
            );
            return error.error.subMessages
        }
        Swal.fire(
          {
            position: 'center',
            title: this.translate.instant("error"),
            text: error.error.message,
            showConfirmButton: true,
            confirmButtonText:this.translate.instant("ok"),
            icon: 'error'
          }
        );
        return null;
      }
      Swal.fire(
        {
          position: 'center',
          title: this.translate.instant("error"),
          text: this.translate.instant("internalError"),
          showConfirmButton: true,
          confirmButtonText:this.translate.instant("ok"),
          icon: 'warning'
        }
      );
      return null;
  }

  handleErrorWithCallBack(error,callback:CallableFunction)
  {
      if(!this.validator.checkIfHasArguments(error,["error"]))
      {
        callback(error);
        return;
      }
      if(this.checkIfBuilt(error.error))
      {
        if(this.checkIfHasArgument(error.error))
        {
            Swal.fire(
              {
                position: 'center',
                title: this.translate.instant("error"),
                text: error.error.message,
                showConfirmButton: true,
                confirmButtonText:this.translate.instant("ok"),
                icon: 'error'
              }
            );
            callback(error);
            return error.error.subMessages
        }
        Swal.fire(
          {
            position: 'center',
            title: this.translate.instant("error"),
            text: error.error.message,
            showConfirmButton: true,
            confirmButtonText:this.translate.instant("ok"),
            icon: 'error'
          }
        );
        callback(error);
        return null;
      }
      Swal.fire(
        {
          position: 'center',
          title: this.translate.instant("error"),
          text: this.translate.instant("internalError"),
          showConfirmButton: true,
          confirmButtonText:this.translate.instant("ok"),
          icon: 'warning'
        }
      );
      callback(error);
      return null;
  }

  private checkIfBuilt(error)
  {
    if(this.validator.checkIfHasArguments(error,["message"]))
      return true;
    return false;
  }

  private checkIfHasArgument(error)
  {
    if(this.validator.checkIfHasArguments(error,["subMessages"]))
      return true;
    return false;
  }

  private staticMessage(title:string,translatedMessage:string)
  {
    Swal.fire(
      {
        position: 'center',
        title: this.translate.instant(title),
        text: this.translate.instant(translatedMessage),
        showConfirmButton: true,
        confirmButtonText:this.translate.instant("ok"),
        icon: "error",
      }
    );
  }

  successMessage(msg:string)
  {
    Swal.fire(
      {
        position: 'center',
        title: this.translate.instant(msg),
        showConfirmButton: true,
        confirmButtonText:this.translate.instant("ok"),
        icon: "success",
      }
    );
  }
}
