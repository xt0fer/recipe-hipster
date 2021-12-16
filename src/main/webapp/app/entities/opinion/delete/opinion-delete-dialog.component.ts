import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOpinion } from '../opinion.model';
import { OpinionService } from '../service/opinion.service';

@Component({
  templateUrl: './opinion-delete-dialog.component.html',
})
export class OpinionDeleteDialogComponent {
  opinion?: IOpinion;

  constructor(protected opinionService: OpinionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.opinionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
