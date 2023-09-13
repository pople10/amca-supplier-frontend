export class BuyerRequest
{
    public id:number;
    
    public email:string;

    public password:string;

    public firstName:string;

    public lastName:string;


    public phone:string;

    public expert:boolean=false;

    public disabled:boolean=false;

    public clear(){
        this.email="";
        this.firstName="";
        this.lastName="";
        this.password="";
        this.phone="";
        this.expert=false;
        this.id=null;
    }
}