import { instanceToPlain, plainToInstance } from 'class-transformer';
import log from 'electron-log';
import { stat } from 'fs';
import { Repository } from 'typeorm';
import { getDataPath } from '../../util';
import AppDataSource from '../data-source';
import DataEntity from '../entity/DataEntity';
import SessionEntity from '../entity/SessionEntity';
import {
  SessionModelInputType,
  SessionModelType,
} from '../models/SessionModel';
import { setSession } from '../redux/slices/SessionSlice';
import { store } from '../redux/store';

class SessionService {
  repository: Repository<SessionEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(SessionEntity);
  }

  private entityToModel(entity: SessionEntity) {
    return instanceToPlain(entity) as unknown as SessionModelType;
  }

  private async getSession(id: number) {
    return this.repository.findOne({
      where: {
        id,
      },
    });
  }

  private async clean(): Promise<void> {
    log.debug('Cleaning database');
    await AppDataSource.query('vacuum');
  }

  public async getFileSize(): Promise<number> {
    const path = `${getDataPath()}/UserData.sqlite3`;
    return new Promise((resolve, reject) => {
      stat(path, (err, stats) => {
        if (err) {
          reject(err);
        }
        log.debug(
          `SQLite File Size: ${(stats.size / 1000000).toLocaleString('en-US', {
            maximumFractionDigits: 2,
          })} MB`
        );
        resolve(stats.size / 1000000);
      });
    });
  }

  public async fetch() {
    const sessions = await this.repository.find();
    return sessions.map((session) => this.entityToModel(session));
  }

  public async create(model: SessionModelInputType) {
    const saved = await this.save(model as SessionModelType);
    this.select(saved);
  }

  public async save(model: SessionModelType) {
    const entity = plainToInstance(SessionEntity, model);
    const resp = await this.repository.save(entity);
    return resp.id;
  }

  public async delete(id: number) {
    const session = await this.getSession(id);
    if (session === null) return;
    await this.repository.remove(session);
    await this.clean();
  }

  public async select(id: number) {
    const session = await this.getSession(id);
    if (session === null) return;
    const model = this.entityToModel(session);
    store.dispatch(setSession(model));
  }

  /**
   * Populate the session's count field
   * Tracks how many data points the session has
   * @param id Session id
   */
  public async update(id: number) {
    log.debug('Updating session', id);
    const session = await this.getSession(id);
    if (session === null) return;
    session.count = await this.getDataCount(id);
    log.debug('Session count', session.count);
    this.repository.save(session);
  }

  private async getDataCount(id: number) {
    return AppDataSource.getRepository(DataEntity)
      .createQueryBuilder()
      .leftJoin('Sessions', 's', 'DataEntity.sessionId=s.id')
      .where('s.id=:id', { id })
      .getCount();
  }
}

export default SessionService;
