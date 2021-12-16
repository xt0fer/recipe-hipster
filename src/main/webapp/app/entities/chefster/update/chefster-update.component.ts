import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IChefster, Chefster } from '../chefster.model';
import { ChefsterService } from '../service/chefster.service';

@Component({
  selector: 'jhi-chefster-update',
  templateUrl: './chefster-update.component.html',
})
export class ChefsterUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
  });

  constructor(protected chefsterService: ChefsterService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ chefster }) => {
      this.updateForm(chefster);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const chefster = this.createFromForm();
    if (chefster.id !== undefined) {
      this.subscribeToSaveResponse(this.chefsterService.update(chefster));
    } else {
      this.subscribeToSaveResponse(this.chefsterService.create(chefster));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChefster>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(chefster: IChefster): void {
    this.editForm.patchValue({
      id: chefster.id,
      firstName: chefster.firstName,
      lastName: chefster.lastName,
      email: chefster.email,
      phoneNumber: chefster.phoneNumber,
    });
  }

  protected createFromForm(): IChefster {
    return {
      ...new Chefster(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
    };
  }
}
