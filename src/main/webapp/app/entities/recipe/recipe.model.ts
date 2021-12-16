import * as dayjs from 'dayjs';
import { IPost } from 'app/entities/post/post.model';
import { IChefster } from 'app/entities/chefster/chefster.model';

export interface IRecipe {
  id?: number;
  title?: string | null;
  notes?: string | null;
  ingredients?: string | null;
  steps?: string | null;
  postDate?: dayjs.Dayjs | null;
  post?: IPost | null;
  chefster?: IChefster | null;
}

export class Recipe implements IRecipe {
  constructor(
    public id?: number,
    public title?: string | null,
    public notes?: string | null,
    public ingredients?: string | null,
    public steps?: string | null,
    public postDate?: dayjs.Dayjs | null,
    public post?: IPost | null,
    public chefster?: IChefster | null
  ) {}
}

export function getRecipeIdentifier(recipe: IRecipe): number | undefined {
  return recipe.id;
}
