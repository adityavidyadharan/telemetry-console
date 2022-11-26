import { Repository } from 'typeorm';
import { ChildProcess, execFile, spawn } from 'child_process';
import { app } from 'electron';
import log from 'electron-log';
import { createReadStream } from 'fs';
import DataEntity from '../entity/DataEntity';
import AppDataSource from '../data-source';
import { getPythonPath } from '../../util';
import { getWindow } from '../../window';
import SessionService from './SessionService';

const csv = require('csv-parser');

export type FileVerification = {
  valid: boolean;
  message: string;
};

class ParseService {
  repository: Repository<DataEntity>;

  sessionService: SessionService;

  constructor() {
    this.repository = AppDataSource.getRepository(DataEntity);
    this.sessionService = new SessionService();
  }

  public async verify(path: string): Promise<FileVerification> {
    const stream = createReadStream(path);
    const target = new Set(['time', 'id', 'message', 'label', 'value', 'unit']);
    return new Promise((resolve) =>
      stream.pipe(csv()).on('headers', (data: string[]) => {
        stream.destroy();
        const headers = new Set(data);
        if (headers.size <= target.size) {
          target.forEach((header) => {
            if (!headers.has(header)) {
              resolve({
                valid: false,
                message: `Missing header: ${header}`,
              });
            }
          });
        } else {
          resolve({
            valid: false,
            message: 'Invalid number of headers',
          });
        }
        resolve({
          valid: true,
          message: 'Valid file',
        });
      })
    );
  }

  public async parse(path: string, session: number) {
    const window = getWindow();
    if (!window) return;
    log.debug('Parsing file', path);

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
      log.verbose('Data Chunk: ', data.toString());
      window.webContents.send('parse:chunk', Number(data.toString()));
    });

    command.stdout.on('close', async (code: number) => {
      window.webContents.send('parse:chunk', 10);
      if (Number(code) === 0) await this.sessionService.update(session);
      window.webContents.send('parse:done', code);
    });
  }
}

export default ParseService;
