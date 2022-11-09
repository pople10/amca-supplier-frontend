import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { BuyerService } from 'src/app/services/buyer.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  data:GenericPageable<any>=new GenericPageable();
  refName="id";
  fields:string[]=["firstName","lastName","email"]
  /* Static columns 
  TODO translate status exist in StatusEnum [Backend] */
  fieldsStatic:string[]=["supplierStatus"];
  fieldsDates:string[]=[];
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
      this.buyerService.getSuppliersWithPageAndSize(page,this.currentSize).subscribe(response=>{
          this.data=response;
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
  
    onChangeSize(data)
    {
      this.currentSize=data.target.value;
      this.getData(0);
    }

    view(id)
    {
      this.router.navigate([`/buyer/suppliers/${id}`]);
    }

    getRate(data)
    {
      if(!data||data.length==0)
        return 0;
      return data.reduce((a,b)=>a+b.rate,0)/data.length;
    }
}
