import * as dayjs from 'dayjs';
import { IPost } from 'app/entities/post/post.model';

export interface IOpinion {
  id?: number;
  contents?: string | null;
  commentDate?: dayjs.Dayjs | null;
  post?: IPost | null;
}

export class Opinion implements IOpinion {
  constructor(public id?: number, public contents?: string | null, public commentDate?: dayjs.Dayjs | null, public post?: IPost | null) {}
}

export function getOpinionIdentifier(opinion: IOpinion): number | undefined {
  return opinion.id;
}
