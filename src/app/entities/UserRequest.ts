export class UserRequest
{
    public id:number;
    
    public email:string;

    public password:string;

    public firstName:string;

    public lastName:string;

    public phone:string;
}

export interface UnitUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
  }



  