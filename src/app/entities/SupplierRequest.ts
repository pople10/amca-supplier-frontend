import { UserRequest } from "./UserRequest";

export class SupplierRequest extends UserRequest
{
    public id:number;
    public socialReason:string;
    public tradeName:string;
    public lawForm:string;
    public nrc:number;
    public commercialCourt:string;
    public creationYear:string;
    public ice:string;
    public capitalMAD:number;
    public officeAddress:string;
    public officeZipCode:number;
    public officeCountry:string;
    public officeCity:string;
    public xAxisMap:string;
    public yAxisMap:string;
    public managerFullName:string;
    public supplierStatus:string;
    public managerFunction:string;
    public professionalFax:string;
    public professionalPhone:string;
    public professionalEmail:string;
    public website:string;
    public activitySector:string[]=[];
    public totalEffective:number;
    public turnoverN1:number;
    public turnoverN2:number;
    public turnoverN3:number;
    public isoCertification:string;
    public otherIsoCertification:string;
    public salesFamily:string[]=[];
    public productsSold:string[]=[];
}