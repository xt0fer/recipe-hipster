import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OpinionComponent } from './list/opinion.component';
import { OpinionDetailComponent } from './detail/opinion-detail.component';
import { OpinionUpdateComponent } from './update/opinion-update.component';
import { OpinionDeleteDialogComponent } from './delete/opinion-delete-dialog.component';
import { OpinionRoutingModule } from './route/opinion-routing.module';

@NgModule({
  imports: [SharedModule, OpinionRoutingModule],
  declarations: [OpinionComponent, OpinionDetailComponent, OpinionUpdateComponent, OpinionDeleteDialogComponent],
  entryComponents: [OpinionDeleteDialogComponent],
})
export class OpinionModule {}
