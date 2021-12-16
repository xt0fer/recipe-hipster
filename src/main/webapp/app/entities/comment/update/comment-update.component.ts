import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IComment, Comment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;

  recipesSharedCollection: IRecipe[] = [];

  editForm = this.fb.group({
    id: [],
    contents: [],
    commentDate: [],
    recipe: [],
  });

  constructor(
    protected commentService: CommentService,
    protected recipeService: RecipeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      if (comment.id === undefined) {
        const today = dayjs().startOf('day');
        comment.commentDate = today;
      }

      this.updateForm(comment);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.createFromForm();
    if (comment.id !== undefined) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  trackRecipeById(index: number, item: IRecipe): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
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

  protected updateForm(comment: IComment): void {
    this.editForm.patchValue({
      id: comment.id,
      contents: comment.contents,
      commentDate: comment.commentDate ? comment.commentDate.format(DATE_TIME_FORMAT) : null,
      recipe: comment.recipe,
    });

    this.recipesSharedCollection = this.recipeService.addRecipeToCollectionIfMissing(this.recipesSharedCollection, comment.recipe);
  }

  protected loadRelationshipsOptions(): void {
    this.recipeService
      .query()
      .pipe(map((res: HttpResponse<IRecipe[]>) => res.body ?? []))
      .pipe(map((recipes: IRecipe[]) => this.recipeService.addRecipeToCollectionIfMissing(recipes, this.editForm.get('recipe')!.value)))
      .subscribe((recipes: IRecipe[]) => (this.recipesSharedCollection = recipes));
  }

  protected createFromForm(): IComment {
    return {
      ...new Comment(),
      id: this.editForm.get(['id'])!.value,
      contents: this.editForm.get(['contents'])!.value,
      commentDate: this.editForm.get(['commentDate'])!.value
        ? dayjs(this.editForm.get(['commentDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      recipe: this.editForm.get(['recipe'])!.value,
    };
  }
}
