import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { RankingComponent } from './ranking.component';

export const rankingRoutes = [
  {
    path: '',
    component: RankingComponent,
    canActivate: [ AuthService ]
  }
];

@NgModule({
  declarations: [
    RankingComponent
  ],
  imports: [
    RouterModule.forChild(rankingRoutes),
    CommonModule,
  ],
  providers: []
})
export class RankingModule { }
