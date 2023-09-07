export class CommentRequest
{
    public comment:string;
    public qualityRate:number=0;
    public competitivePriceRate:number=0;
    public respectDeadlineRate:number=0;
    public expertizeRate:number=0;
    public reactivityRate:number=0;
    public realizationRate:number=0;
    public afterSaleRate:number=0;
    public conditionRate:number=0;
    public supplier_id:number;

    public isValidFields(){
        return (
            this.qualityRate >= 1 && this.qualityRate <= 4 &&
            this.competitivePriceRate >= 1 && this.competitivePriceRate <= 4 &&
            this.respectDeadlineRate >= 1 && this.respectDeadlineRate <= 4 &&
            this.expertizeRate >= 1 && this.expertizeRate <= 4 &&
            this.reactivityRate >= 1 && this.reactivityRate <= 4 &&
            this.realizationRate >= 1 && this.realizationRate <= 4 &&
            this.afterSaleRate >= 1 && this.afterSaleRate <= 4 &&
            this.conditionRate >= 1 && this.conditionRate <= 4
        );
    }
}