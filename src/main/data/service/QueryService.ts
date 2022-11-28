import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
import DataEntity from '../entity/DataEntity';
import { DataModelType } from '../models';
import { selectSessionID } from '../redux/slices/SessionSlice';
import { store } from '../redux/store';

class QueryService {
  repository: Repository<DataEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(DataEntity);
  }

  async get(message: string, label: string): Promise<DataModelType[]> {
    const session = selectSessionID(store.getState());
    const entries = await this.repository
      .createQueryBuilder()
      .select(['time', 'value'])
      .where({ message, label, sessionId: session })
      .getRawMany();
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

  public async test() {
    await AppDataSource.initialize();
    this.get('MCU_pedal_readings', 'accelerator_pedal_1');
  }
}

export default QueryService;
