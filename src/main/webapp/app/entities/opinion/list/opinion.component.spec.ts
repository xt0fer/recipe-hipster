import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OpinionService } from '../service/opinion.service';

import { OpinionComponent } from './opinion.component';

describe('Opinion Management Component', () => {
  let comp: OpinionComponent;
  let fixture: ComponentFixture<OpinionComponent>;
  let service: OpinionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OpinionComponent],
    })
      .overrideTemplate(OpinionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OpinionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OpinionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.opinions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
