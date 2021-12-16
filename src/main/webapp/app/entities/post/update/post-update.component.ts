import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPost, Post } from '../post.model';
import { PostService } from '../service/post.service';
import { IRecipe } from 'app/entities/recipe/recipe.model';
import { RecipeService } from 'app/entities/recipe/service/recipe.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;

  recipesCollection: IRecipe[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    contents: [],
    recipe: [],
  });

  constructor(
    protected postService: PostService,
    protected recipeService: RecipeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.updateForm(post);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const post = this.createFromForm();
    if (post.id !== undefined) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  trackRecipeById(index: number, item: IRecipe): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
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

  protected updateForm(post: IPost): void {
    this.editForm.patchValue({
      id: post.id,
      title: post.title,
      contents: post.contents,
      recipe: post.recipe,
    });

    this.recipesCollection = this.recipeService.addRecipeToCollectionIfMissing(this.recipesCollection, post.recipe);
  }

  protected loadRelationshipsOptions(): void {
    this.recipeService
      .query({ filter: 'post-is-null' })
      .pipe(map((res: HttpResponse<IRecipe[]>) => res.body ?? []))
      .pipe(map((recipes: IRecipe[]) => this.recipeService.addRecipeToCollectionIfMissing(recipes, this.editForm.get('recipe')!.value)))
      .subscribe((recipes: IRecipe[]) => (this.recipesCollection = recipes));
  }

  protected createFromForm(): IPost {
    return {
      ...new Post(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      contents: this.editForm.get(['contents'])!.value,
      recipe: this.editForm.get(['recipe'])!.value,
    };
  }
}
