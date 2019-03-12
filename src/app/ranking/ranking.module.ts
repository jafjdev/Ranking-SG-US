import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { RankingComponent } from './ranking.component';
import { SharedModule } from '../shared';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RankingResolver } from './ranking.resolver';
import { MarketcapPipe } from './marketcap-pipe';

export const rankingRoutes = [
  {
    path: '',
    component: RankingComponent,
    canActivate: [ AuthService ],
     resolve: {
      comapaniesData: RankingResolver
    }
  }
];

@NgModule({
  declarations: [
    RankingComponent,
    MarketcapPipe
  ],
  imports: [
    RouterModule.forChild(rankingRoutes),
    CommonModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ],
  providers: [RankingResolver]
})
export class RankingModule { }
