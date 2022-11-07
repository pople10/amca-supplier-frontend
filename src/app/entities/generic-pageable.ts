import { PageDetails } from "./PageDetails";

export class GenericPageable <T>{
    content : T[];

    pageDetails : PageDetails = new PageDetails;
}
