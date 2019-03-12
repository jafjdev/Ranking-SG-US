import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { SectorService } from '../services/sector.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IndicatorsService } from '../services/indicator.service';
import { Company } from '../models/company';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking.component.html',
  styleUrls: [
    './styles/ranking.styles.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class RankingComponent implements OnInit {
  displayedColumns: string[];
  columns: string[] = ['rank','name', 'latestPrice', 'marketcap', 'sector', 'exchange', 'ttmEps'];
  form: FormGroup;
  exchanges = ['Todos','NASDAQ','NYSE'];
  selectedValue: string[];
  sectors = [];
  orders = [];
  indicator: any = {};
  dataSource1 : MatTableDataSource<Company>;
  data = [];
  dataFija = [];
  dataMovil = [];
  dataFijaMovil = [];
  
  private ngUnsubscribe = new Subject();
  
  @ViewChild('paginator') paginator: MatPaginator;
  constructor(public formBuilder: FormBuilder,
    public sectorService: SectorService,
    public indicatorService: IndicatorsService,
    public afAuth: AngularFireAuth,
    public route: ActivatedRoute
    ) {
      this.form = formBuilder.group({
        exchange: new FormControl(''),
        sector: new FormControl(''),
        marketcap: new FormControl('',[numValidator(50000000)]),
        peratio: new FormControl('',[numValidator(5)])
      });

      this.data = route.snapshot.data['comapaniesData'].data;
          this.data.forEach(value => {
              this.dataFija.push(value);
              this.dataFijaMovil.push(value);
              this.dataMovil.push(value);
          });
          
          this.dataSource1 = new MatTableDataSource(this.data);
          this.displayedColumns = this.columns;

      this.sectorService.getSectors().subscribe((sectors)=>{
        this.sectors = sectors;
    });
  }

  selectionChanged() {
    if(this.selectedValue.length == 0) {
        this.dataSource1.paginator = this.paginator;
        this.displayedColumns = this.columns.concat(this.selectedValue);
        this.dataSource1 = new MatTableDataSource(this.dataFijaMovil);
        this.dataSource1.paginator = this.paginator;
    } else {
      this.dataMovil = this.getRanking(this.selectedValue);
      this.dataSource1 = new MatTableDataSource(this.dataMovil);
      this.dataSource1.paginator = this.paginator;
      this.displayedColumns = this.columns.concat(this.selectedValue);
    }
  }

  getRanking(selectedValue) {
    let rankings = [];
    selectedValue.forEach(value => {
        let individualRanking = [];
        if(value != 'peRatio') {
          this.dataMovil.sort(function (a, b) {
            return (b[value] - a[value]);
          });
        } else {
          this.dataMovil.sort(function (a, b) {
            return (a[value] - b[value]);
          });
        }
          this.dataMovil.forEach(value => {
            individualRanking.push(value);
          });
        rankings.push(individualRanking);
    })

    let symbols = rankings[0].map(value => value.symbol);
    let rank = 0;

    symbols.forEach((value,i) => {
      rank = 0;
      rankings.forEach(companyRanking =>{
        rank += companyRanking.map(e => { return e.symbol; }).indexOf(value);
      })
      
    //  console.log(`${i} -- La compañia ${value} esta en la posicion ${rank}`);
     rankings[0][i].rank = rank;
    })

    rankings[0].sort(function (a, b) {
      return (a['rank'] - b['rank']);
    });
    
    return rankings[0];
}

onSubmit() {
  this.dataFijaMovil = [];
  this.dataMovil = [];
  let marketcap = parseInt(this.form.value.marketcap);
  let peratio = parseInt(this.form.value.peratio);
  if(this.form.value.exchange == 'Todos' && this.form.value.sector == 'Todos') {
      this.dataFija.forEach(value => {
        if(value.peRatio >= peratio && value.marketCap >= marketcap){
          this.dataFijaMovil.push(value);
        }
      });
  } else if(this.form.value.exchange == 'Todos') {
    this.dataFija.forEach(value => {
        if(value.sector == this.form.value.sector && 
          value.peRatio >= peratio && value.marketCap >= marketcap){
            this.dataFijaMovil.push(value);
        }  
    });
  } else if(this.form.value.sector == 'Todos') {
    this.dataFija.forEach(value => {
        if(value.exchange == this.form.value.exchange && 
          value.peRatio >= peratio && value.marketCap >= marketcap){
            this.dataFijaMovil.push(value);
        }  
    });
  } else {
      this.dataFija.forEach(value => {
        if(value.exchange == this.form.value.exchange && value.sector == this.form.value.sector && 
          value.peRatio >= peratio && value.marketCap >= marketcap) {
          this.dataFijaMovil.push(value);
        }
    });
  }
  
  this.dataFijaMovil.forEach(value => {
    this.dataMovil.push(value);
  });
  if( typeof(this.selectedValue) !== 'undefined' && this.selectedValue.length>0  ){
    this.dataMovil = this.getRanking(this.selectedValue);
  }
    this.dataSource1 = new MatTableDataSource(this.dataMovil);
    this.dataSource1.paginator = this.paginator;

}

resetForm(){
  this.dataFijaMovil = [];
  this.dataMovil = [];
  
  this.dataFija.forEach(value => {
      this.dataFijaMovil.push(value);
  });

  this.dataFijaMovil.forEach(value => {
    this.dataMovil.push(value);
  });
  if( typeof(this.selectedValue) !== 'undefined' && this.selectedValue.length>0  ){
    this.dataMovil = this.getRanking(this.selectedValue);
  }
  this.dataSource1 = new MatTableDataSource(this.dataMovil);
  this.dataSource1.paginator = this.paginator;

}

  ngOnInit(): void {
    let user = this.afAuth.auth.currentUser;
    let userId = user.uid;
    this.indicatorService.getUserIndicator(userId).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(indicator => {
        this.indicator = indicator;
        this.getParamsIndicators();
    });
  }

  getParamsIndicators() {
      this.orders = [];
      for (const param in this.indicator) {
        if(param != 'id'){
          this.orders.push({name: getProp(this.indicator,param+'.'+'name'), enable: getProp(this.indicator,param+'.'+'enable'), value: getProp(this.indicator,param+'.'+'value')});
        }
      }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}

function numValidator(top: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value !== undefined && (isNaN(control.value) || control.value < top )) {
        return { 'numValidator': true };
    }
    return null;
  };
}

function getProp (obj, key) {
  return key.split('.').reduce( function (o, x) {
      return (typeof o == "undefined" || o === null) ? o : o[x];
  }, obj);
};
