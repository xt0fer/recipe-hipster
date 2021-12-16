import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChefster, Chefster } from '../chefster.model';
import { ChefsterService } from '../service/chefster.service';

@Injectable({ providedIn: 'root' })
export class ChefsterRoutingResolveService implements Resolve<IChefster> {
  constructor(protected service: ChefsterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChefster> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((chefster: HttpResponse<Chefster>) => {
          if (chefster.body) {
            return of(chefster.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Chefster());
  }
}
