import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuditResponse } from 'src/app/entities/AuditResponse';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { AdminService } from 'src/app/services/admin.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  data:GenericPageable<AuditResponse>=new GenericPageable();
  refName="id";
  fields:string[]=["id","tableName","action","actor"]
  /* Static columns 
  TODO translate status exist in StatusEnum [Backend] */
  fieldsStatic:string[]=[];
  fieldsDates:string[]=["createDate"];
  sizes:number[]=[5,10,20,50,100];
  isLoad:boolean=true;
  doingAction:boolean=false;
  doingActionTo:number=null;
  currentPage:number=0;
  currentSize:number=10;

  constructor(
    private modalService:NgbModal,
    private adminService:AdminService,
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
      this.adminService.getAllAudit(page,this.currentSize).subscribe(response=>{
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
      this.router.navigate([`/admin/suppliers/${id}`]);
    }
}
