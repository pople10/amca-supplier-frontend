import { UserChatResponse } from "./UserChatResponse";

export class RoomMessageResponse
{
    public id:number;
    public sender:UserChatResponse;
    public message:string;
    public createDate:Date;
}