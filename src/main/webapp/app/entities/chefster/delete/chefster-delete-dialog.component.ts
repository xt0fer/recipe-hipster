import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChefster } from '../chefster.model';
import { ChefsterService } from '../service/chefster.service';

@Component({
  templateUrl: './chefster-delete-dialog.component.html',
})
export class ChefsterDeleteDialogComponent {
  chefster?: IChefster;

  constructor(protected chefsterService: ChefsterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.chefsterService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
