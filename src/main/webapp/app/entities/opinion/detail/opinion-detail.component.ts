import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOpinion } from '../opinion.model';

@Component({
  selector: 'jhi-opinion-detail',
  templateUrl: './opinion-detail.component.html',
})
export class OpinionDetailComponent implements OnInit {
  opinion: IOpinion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ opinion }) => {
      this.opinion = opinion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
