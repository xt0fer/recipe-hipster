import { IRecipe } from 'app/entities/recipe/recipe.model';
import { IOpinion } from 'app/entities/opinion/opinion.model';

export interface IPost {
  id?: number;
  title?: string | null;
  contents?: string | null;
  recipe?: IRecipe | null;
  opinions?: IOpinion[] | null;
}

export class Post implements IPost {
  constructor(
    public id?: number,
    public title?: string | null,
    public contents?: string | null,
    public recipe?: IRecipe | null,
    public opinions?: IOpinion[] | null
  ) {}
}

export function getPostIdentifier(post: IPost): number | undefined {
  return post.id;
}
