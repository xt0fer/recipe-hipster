import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOpinion, Opinion } from '../opinion.model';
import { OpinionService } from '../service/opinion.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-opinion-update',
  templateUrl: './opinion-update.component.html',
})
export class OpinionUpdateComponent implements OnInit {
  isSaving = false;

  postsSharedCollection: IPost[] = [];

  editForm = this.fb.group({
    id: [],
    contents: [],
    commentDate: [],
    post: [],
  });

  constructor(
    protected opinionService: OpinionService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ opinion }) => {
      if (opinion.id === undefined) {
        const today = dayjs().startOf('day');
        opinion.commentDate = today;
      }

      this.updateForm(opinion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const opinion = this.createFromForm();
    if (opinion.id !== undefined) {
      this.subscribeToSaveResponse(this.opinionService.update(opinion));
    } else {
      this.subscribeToSaveResponse(this.opinionService.create(opinion));
    }
  }

  trackPostById(index: number, item: IPost): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOpinion>>): void {
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

  protected updateForm(opinion: IOpinion): void {
    this.editForm.patchValue({
      id: opinion.id,
      contents: opinion.contents,
      commentDate: opinion.commentDate ? opinion.commentDate.format(DATE_TIME_FORMAT) : null,
      post: opinion.post,
    });

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing(this.postsSharedCollection, opinion.post);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing(posts, this.editForm.get('post')!.value)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }

  protected createFromForm(): IOpinion {
    return {
      ...new Opinion(),
      id: this.editForm.get(['id'])!.value,
      contents: this.editForm.get(['contents'])!.value,
      commentDate: this.editForm.get(['commentDate'])!.value
        ? dayjs(this.editForm.get(['commentDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      post: this.editForm.get(['post'])!.value,
    };
  }
}
