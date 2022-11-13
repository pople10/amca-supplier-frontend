import { RoomMessageResponse } from "./RoomMessageResponse";
import { UserChatResponse } from "./UserChatResponse";

export class RoomResponse
{
    public id:number;
    public participants:UserChatResponse[]=[];
    public messages:RoomMessageResponse[]=[];
}