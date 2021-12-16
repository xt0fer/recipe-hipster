import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IChefster, Chefster } from '../chefster.model';

import { ChefsterService } from './chefster.service';

describe('Chefster Service', () => {
  let service: ChefsterService;
  let httpMock: HttpTestingController;
  let elemDefault: IChefster;
  let expectedResult: IChefster | IChefster[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ChefsterService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      email: 'AAAAAAA',
      phoneNumber: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Chefster', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Chefster()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Chefster', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Chefster', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
          email: 'BBBBBB',
        },
        new Chefster()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Chefster', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Chefster', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addChefsterToCollectionIfMissing', () => {
      it('should add a Chefster to an empty array', () => {
        const chefster: IChefster = { id: 123 };
        expectedResult = service.addChefsterToCollectionIfMissing([], chefster);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chefster);
      });

      it('should not add a Chefster to an array that contains it', () => {
        const chefster: IChefster = { id: 123 };
        const chefsterCollection: IChefster[] = [
          {
            ...chefster,
          },
          { id: 456 },
        ];
        expectedResult = service.addChefsterToCollectionIfMissing(chefsterCollection, chefster);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Chefster to an array that doesn't contain it", () => {
        const chefster: IChefster = { id: 123 };
        const chefsterCollection: IChefster[] = [{ id: 456 }];
        expectedResult = service.addChefsterToCollectionIfMissing(chefsterCollection, chefster);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chefster);
      });

      it('should add only unique Chefster to an array', () => {
        const chefsterArray: IChefster[] = [{ id: 123 }, { id: 456 }, { id: 30678 }];
        const chefsterCollection: IChefster[] = [{ id: 123 }];
        expectedResult = service.addChefsterToCollectionIfMissing(chefsterCollection, ...chefsterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const chefster: IChefster = { id: 123 };
        const chefster2: IChefster = { id: 456 };
        expectedResult = service.addChefsterToCollectionIfMissing([], chefster, chefster2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(chefster);
        expect(expectedResult).toContain(chefster2);
      });

      it('should accept null and undefined values', () => {
        const chefster: IChefster = { id: 123 };
        expectedResult = service.addChefsterToCollectionIfMissing([], null, chefster, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(chefster);
      });

      it('should return initial array if no Chefster is added', () => {
        const chefsterCollection: IChefster[] = [{ id: 123 }];
        expectedResult = service.addChefsterToCollectionIfMissing(chefsterCollection, undefined, null);
        expect(expectedResult).toEqual(chefsterCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
