import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OpinionDetailComponent } from './opinion-detail.component';

describe('Opinion Management Detail Component', () => {
  let comp: OpinionDetailComponent;
  let fixture: ComponentFixture<OpinionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpinionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ opinion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OpinionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OpinionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load opinion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.opinion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
