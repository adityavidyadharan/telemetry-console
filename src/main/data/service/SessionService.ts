import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import AppDataSource from '../data-source';
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
  }

  public async select(id: number) {
    const session = await this.getSession(id);
    if (session === null) return;
    const model = this.entityToModel(session);
    store.dispatch(setSession(model));
  }
}

export default SessionService;
