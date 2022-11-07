import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerService } from 'src/app/services/buyer.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  loading:boolean;
  data:any;
  id:number;

  constructor(
    private buyerService:BuyerService, 
    private route: ActivatedRoute,
    private handler:HandleRequestService,
    private router:Router,
    private _location: Location,
    public languageService:LanguageService) { }

  ngOnInit(): void {
    this.id=parseInt(this.route.snapshot.paramMap.get('id'));
    if(!this.id)
      this.onError();
    this.loading=true;
    this.buyerService.getSupplierById(this.id).subscribe(response=>{
      this.data=response;
      delete this.data["id"];
      delete this.data["roles"];
    }
    ,  err=>{
      this.handler.handleError(err);
      this.onError();
    }
    ).add(()=>{this.loading=false;});
  }

  onError()
  {
    this.goBack();
  }

  goBack()
  {
    this._location.back();
  }

}
