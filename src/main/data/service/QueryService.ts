import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import DataEntity from '../entity/DataEntity';
import { DataModelType } from '../models';

class QueryService {
  table: string;

  repository: Repository<DataEntity>;

  constructor(table: string) {
    this.table = table;
    this.repository = AppDataSource.getRepository(DataEntity);
  }

  async get(message: string, label: string): Promise<DataModelType[]> {
    const entries = await this.repository.find({
      select: { value: true, time: true },
      where: { message, label },
    });
    return entries;
  }

  async getDistinctMessages(): Promise<string[]> {
    return (
      await this.repository
        .createQueryBuilder()
        .select('message')
        .distinct(true)
        .orderBy('message', 'ASC')
        .getRawMany()
    ).map((entry) => entry.message);
  }

  async getDistinctLabels(message: string): Promise<string[]> {
    return (
      await this.repository
        .createQueryBuilder()
        .select('label')
        .distinct(true)
        .where({ message })
        .orderBy('label', 'ASC')
        .getRawMany()
    ).map((entry) => entry.label);
  }
}

export default QueryService;
