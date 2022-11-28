import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications:any[]=[];
  public static callbacks:any[]=[];

  constructor() { }

  addCallBack(callback)
  {
    NotificationService.callbacks.push(callback);
  }

  setNotification(notifs:any[])
  {
    this.notifications=notifs;
    try
    {
      for(let callback of NotificationService.callbacks)
        callback(this.notifications);
    }catch(e)
    {

    }
  }

  get Notifications():any[]
  {
    return this.notifications;
  }

  get messagesNumber():number
  {
    return this.notifications?.filter(e=>e.notificationType=="MESSAGE_RECEIVED")?.length;
  }

  clearCallbacks()
  {
    NotificationService.callbacks=[];
  }
}
