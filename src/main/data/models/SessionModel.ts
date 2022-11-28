import { DataModelType } from '../models';

export type SessionModelInputType = {
  id?: number;
  name: string;
  location: string;
  date: Date;
  notes: string;
};

export type SessionModelType = SessionModelInputType & {
  id: number;
  data: DataModelType[];
  count: number;
};
