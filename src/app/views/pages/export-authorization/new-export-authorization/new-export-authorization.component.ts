import { Component, OnInit } from '@angular/core';
import { StepperOrientation } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import { WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/services/language/language.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-export-authorization',
  templateUrl: './new-export-authorization.component.html',
  styleUrls: ['./new-export-authorization.component.scss']
})
export class NewExportAuthorizationComponent implements OnInit {
  stepperOrientation: Observable<StepperOrientation>;
  constructor(public formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private modalService: NgbModal,  public  languageService: LanguageService, private router:Router,private translate: TranslateService) { }

  ngOnInit(): void {
  }

}

