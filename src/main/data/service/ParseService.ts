import { Repository } from 'typeorm';
import { ChildProcess, execFile, spawn } from 'child_process';
import { app } from 'electron';
import DataEntity from '../entity/DataEntity';
import AppDataSource from '../data-source';
import SessionEntity from '../entity/SessionEntity';
// import { getWindow } from '../../window';
import { getPythonPath } from '../../util';
import { getWindow } from '../../window';

const fs = require('fs');

const csv = require('csv-parser');

// const { spawn, exec } = require('child_process');

class ParseService {
  dataRepository: Repository<DataEntity>;

  sessionRepository: Repository<SessionEntity>;

  constructor() {
    this.dataRepository = AppDataSource.getRepository(DataEntity);
    this.sessionRepository = AppDataSource.getRepository(SessionEntity);
  }

  public async verify(path: string) {
    const stream = fs.createReadStream(path);
    const target = new Set(['time', 'id', 'message', 'label', 'value', 'unit']);
    return new Promise((resolve) =>
      stream.pipe(csv()).on('headers', (data: string[]) => {
        stream.destroy();
        const headers = new Set(data);
        resolve(
          target.size === headers.size &&
            [...target].every((header) => headers.has(header))
        );
      })
    );
  }

  public async createSession() {
    const entity = new SessionEntity();
    entity.name = 'test';
    entity.date = new Date();
    const resp = await this.sessionRepository.save(entity);
    return resp.id;
  }

  public async parse(path: string) {
    const window = getWindow();
    if (!window) return;
    window.webContents.send('parse:chunk', path);

    console.log(path);
    const session = await this.createSession();

    let command: ChildProcess;
    if (app.isPackaged) {
      command = execFile(getPythonPath('import'), [
        './UserData.sqlite3',
        './data/data0024.CSV',
        String(session),
        String(10),
      ]);
    } else {
      command = spawn('python', [
        'python/import.py',
        './UserData.sqlite3',
        './data/data0024.CSV',
        String(session),
        String(10),
      ]);
    }

    if (command === null || command.stdout === null) return;

    command.stdout.on('data', (data: Buffer) => {
      console.log(data.toString());
    });

    command.stdout.on('close', (code: number) => {
      if (code === 0) window.webContents.send('parse:done', 1);
      else window.webContents.send('parse:done', 0);
    });
  }

  public async test() {
    await AppDataSource.initialize();
    console.log('starting');
    console.time('dbsave');
    await this.parse('./data/data0024.CSV');
    console.timeEnd('dbsave');
  }
}

export default ParseService;

new ParseService().test();
