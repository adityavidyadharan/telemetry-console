import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { getDataPath } from '../util';
import DataEntity from './entity/DataEntity';
import SessionEntity from './entity/SessionEntity';
import MetadataEntity from './entity/SessionDataEntity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: `${getDataPath()}/UserData.sqlite3`, // TODO use UserData folder
  entities: [DataEntity, SessionEntity, MetadataEntity],
  synchronize: true, // TODO might need to remove for production
});

export default AppDataSource;
