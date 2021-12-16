import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IChefster } from '../chefster.model';

@Component({
  selector: 'jhi-chefster-detail',
  templateUrl: './chefster-detail.component.html',
})
export class ChefsterDetailComponent implements OnInit {
  chefster: IChefster | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chefster }) => {
      this.chefster = chefster;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
