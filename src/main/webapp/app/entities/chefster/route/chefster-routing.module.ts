import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChefsterComponent } from '../list/chefster.component';
import { ChefsterDetailComponent } from '../detail/chefster-detail.component';
import { ChefsterUpdateComponent } from '../update/chefster-update.component';
import { ChefsterRoutingResolveService } from './chefster-routing-resolve.service';

const chefsterRoute: Routes = [
  {
    path: '',
    component: ChefsterComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChefsterDetailComponent,
    resolve: {
      chefster: ChefsterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChefsterUpdateComponent,
    resolve: {
      chefster: ChefsterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChefsterUpdateComponent,
    resolve: {
      chefster: ChefsterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(chefsterRoute)],
  exports: [RouterModule],
})
export class ChefsterRoutingModule {}
