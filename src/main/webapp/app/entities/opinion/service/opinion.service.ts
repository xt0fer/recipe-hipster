import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOpinion, getOpinionIdentifier } from '../opinion.model';

export type EntityResponseType = HttpResponse<IOpinion>;
export type EntityArrayResponseType = HttpResponse<IOpinion[]>;

@Injectable({ providedIn: 'root' })
export class OpinionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/opinions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(opinion: IOpinion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(opinion);
    return this.http
      .post<IOpinion>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(opinion: IOpinion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(opinion);
    return this.http
      .put<IOpinion>(`${this.resourceUrl}/${getOpinionIdentifier(opinion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(opinion: IOpinion): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(opinion);
    return this.http
      .patch<IOpinion>(`${this.resourceUrl}/${getOpinionIdentifier(opinion) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOpinion>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOpinion[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOpinionToCollectionIfMissing(opinionCollection: IOpinion[], ...opinionsToCheck: (IOpinion | null | undefined)[]): IOpinion[] {
    const opinions: IOpinion[] = opinionsToCheck.filter(isPresent);
    if (opinions.length > 0) {
      const opinionCollectionIdentifiers = opinionCollection.map(opinionItem => getOpinionIdentifier(opinionItem)!);
      const opinionsToAdd = opinions.filter(opinionItem => {
        const opinionIdentifier = getOpinionIdentifier(opinionItem);
        if (opinionIdentifier == null || opinionCollectionIdentifiers.includes(opinionIdentifier)) {
          return false;
        }
        opinionCollectionIdentifiers.push(opinionIdentifier);
        return true;
      });
      return [...opinionsToAdd, ...opinionCollection];
    }
    return opinionCollection;
  }

  protected convertDateFromClient(opinion: IOpinion): IOpinion {
    return Object.assign({}, opinion, {
      commentDate: opinion.commentDate?.isValid() ? opinion.commentDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.commentDate = res.body.commentDate ? dayjs(res.body.commentDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((opinion: IOpinion) => {
        opinion.commentDate = opinion.commentDate ? dayjs(opinion.commentDate) : undefined;
      });
    }
    return res;
  }
}
