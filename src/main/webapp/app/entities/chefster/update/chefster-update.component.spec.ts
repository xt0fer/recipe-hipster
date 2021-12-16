jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ChefsterService } from '../service/chefster.service';
import { IChefster, Chefster } from '../chefster.model';

import { ChefsterUpdateComponent } from './chefster-update.component';

describe('Chefster Management Update Component', () => {
  let comp: ChefsterUpdateComponent;
  let fixture: ComponentFixture<ChefsterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let chefsterService: ChefsterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChefsterUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(ChefsterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ChefsterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    chefsterService = TestBed.inject(ChefsterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const chefster: IChefster = { id: 456 };

      activatedRoute.data = of({ chefster });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(chefster));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chefster>>();
      const chefster = { id: 123 };
      jest.spyOn(chefsterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefster });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chefster }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(chefsterService.update).toHaveBeenCalledWith(chefster);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chefster>>();
      const chefster = new Chefster();
      jest.spyOn(chefsterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefster });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: chefster }));
      saveSubject.complete();

      // THEN
      expect(chefsterService.create).toHaveBeenCalledWith(chefster);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Chefster>>();
      const chefster = { id: 123 };
      jest.spyOn(chefsterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ chefster });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(chefsterService.update).toHaveBeenCalledWith(chefster);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
