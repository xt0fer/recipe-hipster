import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IOpinion, Opinion } from '../opinion.model';

import { OpinionService } from './opinion.service';

describe('Opinion Service', () => {
  let service: OpinionService;
  let httpMock: HttpTestingController;
  let elemDefault: IOpinion;
  let expectedResult: IOpinion | IOpinion[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OpinionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      contents: 'AAAAAAA',
      commentDate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          commentDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Opinion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          commentDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          commentDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Opinion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Opinion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          contents: 'BBBBBB',
          commentDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          commentDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Opinion', () => {
      const patchObject = Object.assign(
        {
          contents: 'BBBBBB',
        },
        new Opinion()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          commentDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Opinion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          contents: 'BBBBBB',
          commentDate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          commentDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Opinion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOpinionToCollectionIfMissing', () => {
      it('should add a Opinion to an empty array', () => {
        const opinion: IOpinion = { id: 123 };
        expectedResult = service.addOpinionToCollectionIfMissing([], opinion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(opinion);
      });

      it('should not add a Opinion to an array that contains it', () => {
        const opinion: IOpinion = { id: 123 };
        const opinionCollection: IOpinion[] = [
          {
            ...opinion,
          },
          { id: 456 },
        ];
        expectedResult = service.addOpinionToCollectionIfMissing(opinionCollection, opinion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Opinion to an array that doesn't contain it", () => {
        const opinion: IOpinion = { id: 123 };
        const opinionCollection: IOpinion[] = [{ id: 456 }];
        expectedResult = service.addOpinionToCollectionIfMissing(opinionCollection, opinion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(opinion);
      });

      it('should add only unique Opinion to an array', () => {
        const opinionArray: IOpinion[] = [{ id: 123 }, { id: 456 }, { id: 87659 }];
        const opinionCollection: IOpinion[] = [{ id: 123 }];
        expectedResult = service.addOpinionToCollectionIfMissing(opinionCollection, ...opinionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const opinion: IOpinion = { id: 123 };
        const opinion2: IOpinion = { id: 456 };
        expectedResult = service.addOpinionToCollectionIfMissing([], opinion, opinion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(opinion);
        expect(expectedResult).toContain(opinion2);
      });

      it('should accept null and undefined values', () => {
        const opinion: IOpinion = { id: 123 };
        expectedResult = service.addOpinionToCollectionIfMissing([], null, opinion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(opinion);
      });

      it('should return initial array if no Opinion is added', () => {
        const opinionCollection: IOpinion[] = [{ id: 123 }];
        expectedResult = service.addOpinionToCollectionIfMissing(opinionCollection, undefined, null);
        expect(expectedResult).toEqual(opinionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
