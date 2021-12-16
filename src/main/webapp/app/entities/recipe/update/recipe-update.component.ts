import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRecipe, Recipe } from '../recipe.model';
import { RecipeService } from '../service/recipe.service';
import { IChefster } from 'app/entities/chefster/chefster.model';
import { ChefsterService } from 'app/entities/chefster/service/chefster.service';

@Component({
  selector: 'jhi-recipe-update',
  templateUrl: './recipe-update.component.html',
})
export class RecipeUpdateComponent implements OnInit {
  isSaving = false;

  chefstersSharedCollection: IChefster[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    notes: [],
    ingredients: [],
    steps: [],
    postDate: [],
    chefster: [],
  });

  constructor(
    protected recipeService: RecipeService,
    protected chefsterService: ChefsterService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipe }) => {
      if (recipe.id === undefined) {
        const today = dayjs().startOf('day');
        recipe.postDate = today;
      }

      this.updateForm(recipe);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const recipe = this.createFromForm();
    if (recipe.id !== undefined) {
      this.subscribeToSaveResponse(this.recipeService.update(recipe));
    } else {
      this.subscribeToSaveResponse(this.recipeService.create(recipe));
    }
  }

  trackChefsterById(index: number, item: IChefster): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRecipe>>): void {
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

  protected updateForm(recipe: IRecipe): void {
    this.editForm.patchValue({
      id: recipe.id,
      title: recipe.title,
      notes: recipe.notes,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      postDate: recipe.postDate ? recipe.postDate.format(DATE_TIME_FORMAT) : null,
      chefster: recipe.chefster,
    });

    this.chefstersSharedCollection = this.chefsterService.addChefsterToCollectionIfMissing(this.chefstersSharedCollection, recipe.chefster);
  }

  protected loadRelationshipsOptions(): void {
    this.chefsterService
      .query()
      .pipe(map((res: HttpResponse<IChefster[]>) => res.body ?? []))
      .pipe(
        map((chefsters: IChefster[]) =>
          this.chefsterService.addChefsterToCollectionIfMissing(chefsters, this.editForm.get('chefster')!.value)
        )
      )
      .subscribe((chefsters: IChefster[]) => (this.chefstersSharedCollection = chefsters));
  }

  protected createFromForm(): IRecipe {
    return {
      ...new Recipe(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      notes: this.editForm.get(['notes'])!.value,
      ingredients: this.editForm.get(['ingredients'])!.value,
      steps: this.editForm.get(['steps'])!.value,
      postDate: this.editForm.get(['postDate'])!.value ? dayjs(this.editForm.get(['postDate'])!.value, DATE_TIME_FORMAT) : undefined,
      chefster: this.editForm.get(['chefster'])!.value,
    };
  }
}
