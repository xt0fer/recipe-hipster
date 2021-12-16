jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RecipeService } from '../service/recipe.service';
import { IRecipe, Recipe } from '../recipe.model';
import { IChefster } from 'app/entities/chefster/chefster.model';
import { ChefsterService } from 'app/entities/chefster/service/chefster.service';

import { RecipeUpdateComponent } from './recipe-update.component';

describe('Recipe Management Update Component', () => {
  let comp: RecipeUpdateComponent;
  let fixture: ComponentFixture<RecipeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let recipeService: RecipeService;
  let chefsterService: ChefsterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RecipeUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(RecipeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RecipeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    recipeService = TestBed.inject(RecipeService);
    chefsterService = TestBed.inject(ChefsterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Chefster query and add missing value', () => {
      const recipe: IRecipe = { id: 456 };
      const chefster: IChefster = { id: 51306 };
      recipe.chefster = chefster;

      const chefsterCollection: IChefster[] = [{ id: 98252 }];
      jest.spyOn(chefsterService, 'query').mockReturnValue(of(new HttpResponse({ body: chefsterCollection })));
      const additionalChefsters = [chefster];
      const expectedCollection: IChefster[] = [...additionalChefsters, ...chefsterCollection];
      jest.spyOn(chefsterService, 'addChefsterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(chefsterService.query).toHaveBeenCalled();
      expect(chefsterService.addChefsterToCollectionIfMissing).toHaveBeenCalledWith(chefsterCollection, ...additionalChefsters);
      expect(comp.chefstersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const recipe: IRecipe = { id: 456 };
      const chefster: IChefster = { id: 33725 };
      recipe.chefster = chefster;

      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(recipe));
      expect(comp.chefstersSharedCollection).toContain(chefster);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Recipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipe }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalledWith(recipe);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Recipe>>();
      const recipe = new Recipe();
      jest.spyOn(recipeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: recipe }));
      saveSubject.complete();

      // THEN
      expect(recipeService.create).toHaveBeenCalledWith(recipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Recipe>>();
      const recipe = { id: 123 };
      jest.spyOn(recipeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ recipe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(recipeService.update).toHaveBeenCalledWith(recipe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackChefsterById', () => {
      it('Should return tracked Chefster primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackChefsterById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
