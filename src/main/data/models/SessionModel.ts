import { DataModelType } from '../models';

export type SessionModelType = {
  id: number;
  name: string;
  location: string;
  date: Date;
  notes: string;
  data: DataModelType[];
};
