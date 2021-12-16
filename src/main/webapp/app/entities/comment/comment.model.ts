import * as dayjs from 'dayjs';
import { IRecipe } from 'app/entities/recipe/recipe.model';

export interface IComment {
  id?: number;
  contents?: string | null;
  commentDate?: dayjs.Dayjs | null;
  recipe?: IRecipe | null;
}

export class Comment implements IComment {
  constructor(
    public id?: number,
    public contents?: string | null,
    public commentDate?: dayjs.Dayjs | null,
    public recipe?: IRecipe | null
  ) {}
}

export function getCommentIdentifier(comment: IComment): number | undefined {
  return comment.id;
}
