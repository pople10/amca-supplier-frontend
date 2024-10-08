import { RoomMessageResponse } from "./RoomMessageResponse";
import { UserChatResponse } from "./UserChatResponse";

export class RoomResponse
{
    public id:number;
    public participants:UserChatResponse[]=[];
    public messages:RoomMessageResponse[]=[];
    public createDate:Date;
    public label:string;
    public creator:UserChatResponse;
}