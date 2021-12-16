import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChefster, getChefsterIdentifier } from '../chefster.model';

export type EntityResponseType = HttpResponse<IChefster>;
export type EntityArrayResponseType = HttpResponse<IChefster[]>;

@Injectable({ providedIn: 'root' })
export class ChefsterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chefsters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chefster: IChefster): Observable<EntityResponseType> {
    return this.http.post<IChefster>(this.resourceUrl, chefster, { observe: 'response' });
  }

  update(chefster: IChefster): Observable<EntityResponseType> {
    return this.http.put<IChefster>(`${this.resourceUrl}/${getChefsterIdentifier(chefster) as number}`, chefster, { observe: 'response' });
  }

  partialUpdate(chefster: IChefster): Observable<EntityResponseType> {
    return this.http.patch<IChefster>(`${this.resourceUrl}/${getChefsterIdentifier(chefster) as number}`, chefster, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChefster>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChefster[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addChefsterToCollectionIfMissing(chefsterCollection: IChefster[], ...chefstersToCheck: (IChefster | null | undefined)[]): IChefster[] {
    const chefsters: IChefster[] = chefstersToCheck.filter(isPresent);
    if (chefsters.length > 0) {
      const chefsterCollectionIdentifiers = chefsterCollection.map(chefsterItem => getChefsterIdentifier(chefsterItem)!);
      const chefstersToAdd = chefsters.filter(chefsterItem => {
        const chefsterIdentifier = getChefsterIdentifier(chefsterItem);
        if (chefsterIdentifier == null || chefsterCollectionIdentifiers.includes(chefsterIdentifier)) {
          return false;
        }
        chefsterCollectionIdentifiers.push(chefsterIdentifier);
        return true;
      });
      return [...chefstersToAdd, ...chefsterCollection];
    }
    return chefsterCollection;
  }
}
