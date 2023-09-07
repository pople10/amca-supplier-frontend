import { RegisterModel } from "./auth/register-model";
import { SupplierRequest } from "./SupplierRequest";

export class CommentResponse
{
    public id:number;
    public buyer:RegisterModel;
    public supplier:SupplierRequest;
    public comment:string;
    public qualityRate:number;
    public competitivePriceRate:number;
    public respectDeadlineRate:number;
    public expertizeRate:number;
    public reactivityRate:number;
    public realizationRate:number;
    public afterSaleRate:number;
    public conditionRate:number;
    public rate:number;
}