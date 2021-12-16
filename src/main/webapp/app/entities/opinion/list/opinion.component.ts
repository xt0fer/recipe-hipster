import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOpinion } from '../opinion.model';
import { OpinionService } from '../service/opinion.service';
import { OpinionDeleteDialogComponent } from '../delete/opinion-delete-dialog.component';

@Component({
  selector: 'jhi-opinion',
  templateUrl: './opinion.component.html',
})
export class OpinionComponent implements OnInit {
  opinions?: IOpinion[];
  isLoading = false;

  constructor(protected opinionService: OpinionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.opinionService.query().subscribe(
      (res: HttpResponse<IOpinion[]>) => {
        this.isLoading = false;
        this.opinions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOpinion): number {
    return item.id!;
  }

  delete(opinion: IOpinion): void {
    const modalRef = this.modalService.open(OpinionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.opinion = opinion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
