import { IRecipe } from 'app/entities/recipe/recipe.model';

export interface IChefster {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  recipes?: IRecipe[] | null;
}

export class Chefster implements IChefster {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public recipes?: IRecipe[] | null
  ) {}
}

export function getChefsterIdentifier(chefster: IChefster): number | undefined {
  return chefster.id;
}
