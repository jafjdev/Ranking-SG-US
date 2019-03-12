import { Injectable, OnDestroy } from '@angular/core';
import { Resolve } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class RankingResolver implements Resolve<any>, OnDestroy {
  private ngUnsubscribe = new Subject();
  constructor(private companyService: CompanyService) {}

  resolve() {
    return new Promise((resolve, reject) => {
      this.companyService.getCompanies().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((comapaniesData: any) => {
        return resolve({
          data: comapaniesData
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}