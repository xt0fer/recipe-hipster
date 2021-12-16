import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OpinionComponent } from '../list/opinion.component';
import { OpinionDetailComponent } from '../detail/opinion-detail.component';
import { OpinionUpdateComponent } from '../update/opinion-update.component';
import { OpinionRoutingResolveService } from './opinion-routing-resolve.service';

const opinionRoute: Routes = [
  {
    path: '',
    component: OpinionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OpinionDetailComponent,
    resolve: {
      opinion: OpinionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OpinionUpdateComponent,
    resolve: {
      opinion: OpinionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OpinionUpdateComponent,
    resolve: {
      opinion: OpinionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(opinionRoute)],
  exports: [RouterModule],
})
export class OpinionRoutingModule {}
