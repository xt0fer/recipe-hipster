import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChefsterComponent } from './list/chefster.component';
import { ChefsterDetailComponent } from './detail/chefster-detail.component';
import { ChefsterUpdateComponent } from './update/chefster-update.component';
import { ChefsterDeleteDialogComponent } from './delete/chefster-delete-dialog.component';
import { ChefsterRoutingModule } from './route/chefster-routing.module';

@NgModule({
  imports: [SharedModule, ChefsterRoutingModule],
  declarations: [ChefsterComponent, ChefsterDetailComponent, ChefsterUpdateComponent, ChefsterDeleteDialogComponent],
  entryComponents: [ChefsterDeleteDialogComponent],
})
export class ChefsterModule {}
