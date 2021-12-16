import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ChefsterDetailComponent } from './chefster-detail.component';

describe('Chefster Management Detail Component', () => {
  let comp: ChefsterDetailComponent;
  let fixture: ComponentFixture<ChefsterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChefsterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ chefster: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ChefsterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ChefsterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load chefster on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.chefster).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
