jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { OpinionService } from '../service/opinion.service';
import { IOpinion, Opinion } from '../opinion.model';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

import { OpinionUpdateComponent } from './opinion-update.component';

describe('Opinion Management Update Component', () => {
  let comp: OpinionUpdateComponent;
  let fixture: ComponentFixture<OpinionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let opinionService: OpinionService;
  let postService: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OpinionUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(OpinionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OpinionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    opinionService = TestBed.inject(OpinionService);
    postService = TestBed.inject(PostService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Post query and add missing value', () => {
      const opinion: IOpinion = { id: 456 };
      const post: IPost = { id: 68587 };
      opinion.post = post;

      const postCollection: IPost[] = [{ id: 78084 }];
      jest.spyOn(postService, 'query').mockReturnValue(of(new HttpResponse({ body: postCollection })));
      const additionalPosts = [post];
      const expectedCollection: IPost[] = [...additionalPosts, ...postCollection];
      jest.spyOn(postService, 'addPostToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ opinion });
      comp.ngOnInit();

      expect(postService.query).toHaveBeenCalled();
      expect(postService.addPostToCollectionIfMissing).toHaveBeenCalledWith(postCollection, ...additionalPosts);
      expect(comp.postsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const opinion: IOpinion = { id: 456 };
      const post: IPost = { id: 69642 };
      opinion.post = post;

      activatedRoute.data = of({ opinion });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(opinion));
      expect(comp.postsSharedCollection).toContain(post);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Opinion>>();
      const opinion = { id: 123 };
      jest.spyOn(opinionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ opinion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: opinion }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(opinionService.update).toHaveBeenCalledWith(opinion);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Opinion>>();
      const opinion = new Opinion();
      jest.spyOn(opinionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ opinion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: opinion }));
      saveSubject.complete();

      // THEN
      expect(opinionService.create).toHaveBeenCalledWith(opinion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Opinion>>();
      const opinion = { id: 123 };
      jest.spyOn(opinionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ opinion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(opinionService.update).toHaveBeenCalledWith(opinion);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPostById', () => {
      it('Should return tracked Post primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPostById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
