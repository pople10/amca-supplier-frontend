export interface AuditResponse{
    id: number;
    tableName: string;
    actor:string;
    action:string;
    createDate:Date
  }