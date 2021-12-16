jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IChefster, Chefster } from '../chefster.model';
import { ChefsterService } from '../service/chefster.service';

import { ChefsterRoutingResolveService } from './chefster-routing-resolve.service';

describe('Chefster routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ChefsterRoutingResolveService;
  let service: ChefsterService;
  let resultChefster: IChefster | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ChefsterRoutingResolveService);
    service = TestBed.inject(ChefsterService);
    resultChefster = undefined;
  });

  describe('resolve', () => {
    it('should return IChefster returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChefster = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChefster).toEqual({ id: 123 });
    });

    it('should return new IChefster if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChefster = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultChefster).toEqual(new Chefster());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Chefster })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultChefster = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultChefster).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
