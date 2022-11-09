import { RegisterModel } from "./auth/register-model";
import { SupplierRequest } from "./SupplierRequest";

export class CommentResponse
{
    public id:number;
    public buyer:RegisterModel;
    public supplier:SupplierRequest;
    public comment:string;
    public rate:number;
}