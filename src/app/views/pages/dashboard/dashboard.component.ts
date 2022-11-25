import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexGrid, ApexChart, ApexXAxis, ApexYAxis, ApexMarkers, ApexStroke, ApexLegend, ApexResponsive, ApexTooltip, ApexFill, ApexDataLabels, ApexPlotOptions, ApexTitleSubtitle, ChartComponent } from 'ng-apexcharts';

import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

// Ng2-charts
import { ChartOptions, ChartType, ChartDataSets, RadialChartOptions } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';

import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language/language.service';
import { AuthService } from 'src/app/services/auth.service';
import { StatisticsService } from 'src/app/services/statstics.service';
import { HandleRequestService } from 'src/app/services/shared/handle-request.service';
import { StatsticsModel } from 'src/app/entities/stats/StatisticsModel';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

export type apexChartOptions = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: any;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle
};


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent implements OnInit,OnDestroy {

  @ViewChild("chart1") chart1:ChartComponent;
  @ViewChild("chart2") chart2:ChartComponent;
  @ViewChild("chart3") chart3:ChartComponent;
  @ViewChild("chart4") chart4:ChartComponent;
  @ViewChild("chart5") chart5:ChartComponent;

  statsData:StatsticsModel=new StatsticsModel();

  /**
   * Apex chart
   */
  public apexChart1Options: Partial<apexChartOptions>;
  public apexChart2Options: Partial<apexChartOptions>;
  public apexChart3Options: Partial<apexChartOptions>;
  public apexChart4Options: Partial<any>;
  public apexChart5Options: Partial<any>;

  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct;
  isAdmin = false;

  /**
   * Ng2 Bar Chart 1
   */
   public toTranslate: Label[] = ["Jan","Fev","Mar","Apr","Mai","Juin","Juil","Aug","Sep","Oct","Nov","Dec"];
  public months: Label[] = ["Jan","Fev","Mar","Apr","Mai","Juin","Juil","Aug","Sep","Nov","Oct","Dec"];

  translateMonth()
  {
    for(let i=0;i<this.months.length;i++)
    {
      this.months[i]=this.translateService.instant(this.toTranslate[i]);
    }
  }


  constructor( private translateService:TranslateService,private handleRequestService:HandleRequestService,private statisticsService:StatisticsService,private authService:AuthService,private calendar: NgbCalendar, private router: Router, public languageService: LanguageService) {
    this.loading();
  }



  year:number=new Date().getFullYear();

  ngOnDestroy(): void {
    LanguageService.callbacks=[];
  }

  roles:string[];

  dataLoaded:boolean=false;

  ngOnInit(): void {
    let userData = localStorage.getItem("userData");
    if(userData == null){
      this.authService.logOut();
    }else{
      let data = JSON.parse(userData);
      this.roles = data.roles;
    }
    this.currentDate = this.calendar.getToday();

    if(!this.roles.includes("admin"))
      return;

    this.statisticsService.getStatsAdmin().subscribe(response=>{
      this.statsData=response;
      this.dataLoaded=true;
      this.loadOptions(this.languageService.userLanguage);
    },err=>{this.handleRequestService.handleError(err)});
    LanguageService.callbacks.push(()=>{
      window.location.reload();
    })

  }

  loadOptions(lang,refresh=false)
  {
    this.apexChart1Options.series=[{
      name:this.translateService.instant("buyers"),
      data:this.statsData.years.buyers.map(e=>e.count)
    }]
    this.apexChart2Options.series=[{
      name:this.translateService.instant("suppliers"),
      data:this.statsData.years.suppliers.map(e=>e.count)
    }]
    this.apexChart3Options.series=[{
      name:this.translateService.instant("users"),
      data:this.statsData.years.users.map(e=>e.count)
    }]

    this.apexChart1Options.title={
      text: this.translateService.instant("buyersPerYear",{year:this.year}),
      align:"center"
    }
    this.apexChart2Options.title={
      text: this.translateService.instant("suppliersPerYear",{year:this.year}),
      align:"center"
    }
    this.apexChart3Options.title={
      text: this.translateService.instant("usersPerYear",{year:this.year}),
      align:"center"
    }
    this.apexChart4Options.title={
      text: this.translateService.instant("buyersType"),
      align:"center"
    }
    this.apexChart5Options.title={
      text: this.translateService.instant("suppliersType"),
      align:"center"
    }
    
    this.apexChart4Options.series=this.statsData.categories.buyers.map(e=>e.count);
    this.apexChart4Options.labels=this.statsData.categories.buyers.map(e=>this.translateService.instant(e.label));
    this.apexChart5Options.series=this.statsData.categories.suppliers.map(e=>e.count);
    this.apexChart5Options.labels=this.statsData.categories.suppliers.map(e=>this.translateService.instant(e.label));
    if(refresh)
    {
      this.apexChart1Options.xaxis.categories=this.months;
      this.apexChart2Options.xaxis.categories=this.months;
      this.apexChart3Options.xaxis.categories=this.months;
    }
  }



  loading()
  {
    
    this.translateMonth();

    /**
     * ApexChart1 options
     */
     this.apexChart1Options = {
      series: [
        {
          name: this.translateService.instant("buyers"),
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        stacked: true,
        locales: [{
          "name": "fr",
          "options": {
            "toolbar": {
                "download": "Télécharger",
                "selection": "Séléction",
                "exportToSVG": "Exporter SVG",
                "exportToPNG": "Exporter PNG",
                "exportToCSV": "Exporter CSV",
                "menu": "Menu",
                "selectionZoom": "Séléction Zoom",
                "zoomIn": "Agrandir",
                "zoomOut": "Dézoomer",
                "pan": "Panoramique",
                "reset": "Réinitialiser le zoom"
            }
          }
        },
        {
          "name": "ar",
          "options": {
            "toolbar": {
                "download": "تحميل",
                "selection": "اختيار",
                "exportToSVG": "تصدير SVG",
                "exportToPNG": "تصدير PNG",
                "exportToCSV": "تصدير CSV",
                "menu": "القائمة",
                "selectionZoom": "اختيار التكبير",
                "zoomIn": "تكبير",
                "zoomOut": "تصغير",
                "pan": "بانورامي",
                "reset": "إعادة تعيين التكبير"
            }
          }
        }],
        defaultLocale: this.languageService.userLanguage
      },
      title: {
        text: this.translateService.instant("buyersPerYear",{year:this.year}),
        align:"center"
      },
      xaxis: {
        categories: this.months
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      }
    };



    /**
     * ApexChart2 options
     */
    this.apexChart2Options = {
      series: [
        {
          name: this.translateService.instant("suppliers"),
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        stacked: true,
        locales: [{
          "name": "fr",
          "options": {
            "toolbar": {
                "download": "Télécharger",
                "selection": "Séléction",
                "exportToSVG": "Exporter SVG",
                "exportToPNG": "Exporter PNG",
                "exportToCSV": "Exporter CSV",
                "menu": "Menu",
                "selectionZoom": "Séléction Zoom",
                "zoomIn": "Agrandir",
                "zoomOut": "Dézoomer",
                "pan": "Panoramique",
                "reset": "Réinitialiser le zoom"
            }
          }
        },
        {
          "name": "ar",
          "options": {
            "toolbar": {
                "download": "تحميل",
                "selection": "اختيار",
                "exportToSVG": "تصدير SVG",
                "exportToPNG": "تصدير PNG",
                "exportToCSV": "تصدير CSV",
                "menu": "القائمة",
                "selectionZoom": "اختيار التكبير",
                "zoomIn": "تكبير",
                "zoomOut": "تصغير",
                "pan": "بانورامي",
                "reset": "إعادة تعيين التكبير"
            }
          }
        }],
        defaultLocale: this.languageService.userLanguage
      },
      title: {
        text: this.translateService.instant("suppliersPerYear",{year:this.year}),
        align:"center"
      },
      xaxis: {
        categories: this.months
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      }
    };



    /**
     * ApexChart3 options
     */
     this.apexChart3Options = {
      series: [
        {
          name: this.translateService.instant("users"),
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: true,
        locales: [{
          "name": "fr",
          "options": {
            "toolbar": {
                "download": "Télécharger",
                "selection": "Séléction",
                "exportToSVG": "Exporter SVG",
                "exportToPNG": "Exporter PNG",
                "exportToCSV": "Exporter CSV",
                "menu": "Menu",
                "selectionZoom": "Séléction Zoom",
                "zoomIn": "Agrandir",
                "zoomOut": "Dézoomer",
                "pan": "Panoramique",
                "reset": "Réinitialiser le zoom"
            }
          }
        },
        {
          "name": "ar",
          "options": {
            "toolbar": {
                "download": "تحميل",
                "selection": "اختيار",
                "exportToSVG": "تصدير SVG",
                "exportToPNG": "تصدير PNG",
                "exportToCSV": "تصدير CSV",
                "menu": "القائمة",
                "selectionZoom": "اختيار التكبير",
                "zoomIn": "تكبير",
                "zoomOut": "تصغير",
                "pan": "بانورامي",
                "reset": "إعادة تعيين التكبير"
            }
          }
        }],
        defaultLocale: this.languageService.userLanguage
      },
      title: {
        text: this.translateService.instant("usersPerYear",{year:this.year}),
        align:"center"
      },
      xaxis: {
        categories: this.months
      },
      plotOptions: {
        bar: {
          distributed: true
        }
      }
     }



    /**
     * ApexChart4 options
     */
    this.apexChart4Options =
    {
      series: [{
        data:[]
      }],
      chart: {
        type: "donut"
      },
      title: {
        text: this.translateService.instant("buyersType"),
        align:"center"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };


    this.apexChart5Options={...this.apexChart4Options}

    this.apexChart5Options.title={
      text: this.translateService.instant("suppliersType"),
      align:"center"
    }
  }

  getIcon(label:string)
  {
    if(label=='CREATED')
      return "lock_open";
    return "lock";
  }

  getColor(label:string)
  {
    if(label=='CREATED')
      return "green";
    return "red";
  }
}
