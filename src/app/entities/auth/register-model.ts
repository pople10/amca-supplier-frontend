export class RegisterModel {
    public email:string;

    public password:string;

    public firstname:string;

    public lastname:string;

    public cin:string;

    public phoneNumber:string;

    public accountType:string;

    public redirectTo:string;

    public clear(){
        this.cin='';
        this.email="";
        this.firstname="";
        this.lastname="";
        this.password="";
        this.phoneNumber="";
        this.accountType="PERSON";
    }
}
