import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecipe, getRecipeIdentifier } from '../recipe.model';

export type EntityResponseType = HttpResponse<IRecipe>;
export type EntityArrayResponseType = HttpResponse<IRecipe[]>;

@Injectable({ providedIn: 'root' })
export class RecipeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recipes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .post<IRecipe>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .put<IRecipe>(`${this.resourceUrl}/${getRecipeIdentifier(recipe) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(recipe: IRecipe): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(recipe);
    return this.http
      .patch<IRecipe>(`${this.resourceUrl}/${getRecipeIdentifier(recipe) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRecipe>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRecipe[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRecipeToCollectionIfMissing(recipeCollection: IRecipe[], ...recipesToCheck: (IRecipe | null | undefined)[]): IRecipe[] {
    const recipes: IRecipe[] = recipesToCheck.filter(isPresent);
    if (recipes.length > 0) {
      const recipeCollectionIdentifiers = recipeCollection.map(recipeItem => getRecipeIdentifier(recipeItem)!);
      const recipesToAdd = recipes.filter(recipeItem => {
        const recipeIdentifier = getRecipeIdentifier(recipeItem);
        if (recipeIdentifier == null || recipeCollectionIdentifiers.includes(recipeIdentifier)) {
          return false;
        }
        recipeCollectionIdentifiers.push(recipeIdentifier);
        return true;
      });
      return [...recipesToAdd, ...recipeCollection];
    }
    return recipeCollection;
  }

  protected convertDateFromClient(recipe: IRecipe): IRecipe {
    return Object.assign({}, recipe, {
      postDate: recipe.postDate?.isValid() ? recipe.postDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.postDate = res.body.postDate ? dayjs(res.body.postDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((recipe: IRecipe) => {
        recipe.postDate = recipe.postDate ? dayjs(recipe.postDate) : undefined;
      });
    }
    return res;
  }
}
