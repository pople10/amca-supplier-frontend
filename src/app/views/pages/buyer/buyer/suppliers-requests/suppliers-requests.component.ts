import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { BuyerService } from 'src/app/services/buyer.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suppliers-requests',
  templateUrl: './suppliers-requests.component.html',
  styleUrls: ['./suppliers-requests.component.scss']
})
export class SuppliersRequestsComponent implements OnInit {
  data:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=[]
  /* Static columns 
  TODO translate status exist in StatusEnum [Backend] */
  fieldsStatic:string[]=["approved"];
  fieldsDates:string[]=["createDate","modifyDate"];
  sizes:number[]=[5,10,20,50,100];
  isLoad:boolean=true;
  doingAction:boolean=false;
  doingActionTo:number=null;
  currentPage:number=0;
  currentSize:number=10;

  constructor(
    private modalService:NgbModal,
    private buyerService:BuyerService,
    private handleRequestService:HandleRequestService,
    public languageService:LanguageService,
    private translate:TranslateService,
    private router:Router
    ) 
    {

    }

    ngOnInit(): void {
      this.initData();
    }
  
    private initData()
    {
      this.getData(0);
    }
  
    private getData(page:number)
    {
      this.isLoad=true;
      this.buyerService.getApproveRequestsWithPageAndSize(page,this.currentSize).subscribe(response=>{
          this.data=response;
          console.log(this.data.content,this.data,this.data.pageDetails);
      },err=>{
          this.handleRequestService.handleErrorWithCallBack(err,()=>{
            this.router.navigate(["/error"]);
          });
      }).add(()=>{
        this.currentPage=page;
        this.isLoad=false;
      });
    }
  
    onChangePage(page)
    {
      this.getData(page-1);
    }
  
    updateItem(refToUpdate,index)
    {
      this.doingActionTo=index;
      this.doingAction=true;
    }
  
    deleteItem(componant,refToDelete,index){
      this.modalService.open(componant, {centered: true}).result.then((result) => {
        if(result == "save"){
        this.doingAction=true;
        this.doingActionTo=index;
        this.doingAction=false;this.doingActionTo=null;
      }});
    }

    approveItem(componant,id,index)
    {
      this.modalService.open(componant, {centered: true}).result.then((result) => {
        if(result == "save"){
        this.doingAction=true;
        this.doingActionTo=index;
        this.buyerService.approveRequest(id).subscribe(e=>{
            if(this.data.pageDetails.numberOfElements<=1&&this.currentPage!=0)
              this.currentPage=this.currentPage-1;
            this.getData(this.currentPage);
            if(this.data.content.length==0&&this.currentPage!=0) 
            {
              this.getData(0);
            }
            Swal.fire( { position: 'center', title: this.translate.instant("approved_done"), text: '', showConfirmButton: false, timer: 2000, icon: 'success' } );
          },
          error=>{ this.handleRequestService.handleError(error)})
          .add(()=>{this.doingAction=false;this.doingActionTo=null;})
        }});
    }
  
    onChangeSize(data)
    {
      this.currentSize=data.target.value;
      this.getData(0);
    }

    view(id,index)
    {
      this.router.navigate([`/buyer/suppliers/${this.data.content[index]?.supplier?.id}`]);
    }

}
