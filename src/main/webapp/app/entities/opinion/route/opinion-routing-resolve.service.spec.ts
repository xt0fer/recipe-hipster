jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IOpinion, Opinion } from '../opinion.model';
import { OpinionService } from '../service/opinion.service';

import { OpinionRoutingResolveService } from './opinion-routing-resolve.service';

describe('Opinion routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OpinionRoutingResolveService;
  let service: OpinionService;
  let resultOpinion: IOpinion | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(OpinionRoutingResolveService);
    service = TestBed.inject(OpinionService);
    resultOpinion = undefined;
  });

  describe('resolve', () => {
    it('should return IOpinion returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOpinion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOpinion).toEqual({ id: 123 });
    });

    it('should return new IOpinion if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOpinion = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOpinion).toEqual(new Opinion());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Opinion })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOpinion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOpinion).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
