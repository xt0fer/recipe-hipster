import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOpinion, Opinion } from '../opinion.model';
import { OpinionService } from '../service/opinion.service';

@Injectable({ providedIn: 'root' })
export class OpinionRoutingResolveService implements Resolve<IOpinion> {
  constructor(protected service: OpinionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOpinion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((opinion: HttpResponse<Opinion>) => {
          if (opinion.body) {
            return of(opinion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Opinion());
  }
}
