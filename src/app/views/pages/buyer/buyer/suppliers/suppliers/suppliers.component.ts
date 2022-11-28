import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty } from 'rxjs/operators';
import { GenericPageable } from 'src/app/entities/generic-pageable';
import { ValueLabelModel } from 'src/app/entities/shared/ValueLabelModel';
import { Specification } from 'src/app/entities/Specification';
import { BuyerService } from 'src/app/services/buyer.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { GeneralService } from 'src/app/services/shared/general.service';
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
  search=null;

  spec:Specification=new Specification();

  selectedSocials:string[]=[];
  selectedFunctions:string[]=[];
  selectedActivities:string[]=[];
  selectedFamily:string[]=[];

  socials:string[]=[];
  socialsGlobal:string[]=[];
  family:ValueLabelModel[]=[];
  functions:ValueLabelModel[]=[];
  activities:ValueLabelModel[]=[];

  filter()
  {
    this.spec.values={};
    if(this.selectedSocials&&this.selectedSocials.length!=0)
    {
      this.spec.values["socialReason"]=this.selectedSocials;
    }
    
    if(this.selectedFamily&&this.selectedFamily.length!=0)
    {
      this.spec.values["salesFamily"]=this.selectedFamily;
    }

    if(this.selectedActivities&&this.selectedActivities.length!=0)
    {
      this.spec.values["activitySector"]=this.selectedActivities;
    }
    if(this.selectedFunctions&&this.selectedFunctions.length!=0)
    {
      this.spec.values["managerFunction"]=this.selectedFunctions;
    }
    if(!this.emptyJson(this.spec.values))
    {
      this.currentPage=0;
      this.getData(this.currentPage);
    }
  }

  cancelFilter()
  {
    this.spec=new Specification();
    this.selectedActivities=[];
    this.selectedFamily=[];
    this.selectedFunctions=[];
    this.selectedSocials=[];
    this.currentPage=0;
    this.getData(this.currentPage);
  }

  emptyJson(json:any):boolean
  {
    return Object.keys(json).length==0;
  }

  constructor(
    private modalService:NgbModal,
    private buyerService:BuyerService,
    private handleRequestService:HandleRequestService,
    public languageService:LanguageService,
    private translate:TranslateService,
    private generalService:GeneralService,
    private router:Router
    ) 
    {
      this.buyerService.getSocialReasons().subscribe(response=>{
        this.socials=response;
        this.socialsGlobal=response;
      })
      this.generalService.getSupplierConsts().subscribe(response=>{
        this.family=response.filter(e=>e.name=="salesfamily")[0].data;
        this.activities=response.filter(e=>e.name=="sectoractivity")[0].data;
        this.functions=response.filter(e=>e.name=="managerfunctions")[0].data;
      });
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
      this.buyerService.getSuppliersWithPageAndSize(page,this.currentSize,this.spec).subscribe(response=>{
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

  onKey(value) { 
    if(!this.search||this.search.trim()=="")
    {
      this.socials=this.socialsGlobal;
      return;
    }
    this.socials=this.socialsGlobal.filter(e=>e.toLowerCase().includes(this.search.toLowerCase()))
  }
  openChanged(e)
  {
    if(e==false)
    {
      this.socials=this.socialsGlobal;
      this.search=null;
    }
  }
}
