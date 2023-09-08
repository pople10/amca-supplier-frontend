import { UserChatResponse } from './UserChatResponse';

export class UnitPostResponse {
  id: number;
  title: string;
  creator: UserChatResponse;
  createDate: Date;
  modifyDate: Date;
  content: string;
  count: number;
  liked?:boolean;
}


export class PostCommentReplyResponse {
  id: number;
  creator: UserChatResponse;
  liked: boolean;
  createDate: Date;
  modifyDate: Date;
  count: number;
  content: string;
}

export class PostCommentResponse {
  id: number;
  creator: UserChatResponse;
  liked: boolean;
  createDate: Date;
  modifyDate: Date;
  count: number;
  content: string;
  replies: PostCommentReplyResponse[];
}

export class PostResponse extends UnitPostResponse {
  id: number;
  liked: boolean;
  content: string;
  comments: PostCommentResponse[];
}

