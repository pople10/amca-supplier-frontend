export interface LoginResponse{
  username: any;
  roles: string[];
  access_token:string;
  token_type:string;
  expires_in:number
}
