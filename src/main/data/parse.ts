import { Repository } from 'typeorm';
import DataEntity from './entity/DataEntity';
import AppDataSource from './data-source';
import { DataModelType } from './models/DataModel';

const csv = require('csv-parser');

const fs = require('fs');

class Parse {
  repository: Repository<DataEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(DataEntity);
  }

  public async parse(path: string): Promise<DataEntity[]> {
    // await AppDataSource.initialize();
    const results: DataEntity[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(
          csv({
            headers: [
              'time',
              'message_id',
              'message',
              'label',
              'value',
              'unit',
            ],
            skipLines: 1,
          })
        )
        .on('data', (data: DataModelType) => {
          results.push(new DataEntity(data));
          // results.push(this.repository.save(new DataEntity(data)));
        })
        .on('end', async () => {
          console.log('end');
          // resolve(Promise.all(results));
          resolve(this.repository.save(results, { chunk: 1000 }));
        })
        .on('error', reject);
    });
  }

  public async test() {
    await AppDataSource.initialize();
    console.time('dbsave');
    await this.parse('./data/data0020.CSV');
    console.timeEnd('dbsave');
  }
}

new Parse().test();
