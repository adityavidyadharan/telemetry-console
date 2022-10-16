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

  public async parse(path: string) {
    // await AppDataSource.initialize();
    const results: DataEntity[] = [];
    // time,id,message,label,value,unit
    // return AppDataSource.manager.transaction(
    //   async (transactionalEntityManager) => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(
          csv({
            headers: ['time', 'id', 'message', 'label', 'value', 'unit'],
            skipLines: 1,
          })
        )
        .on('data', async (data: DataModelType) => {
          results.push(new DataEntity(data));
          // await transactionalEntityManager.save(new DataEntity(data));
          // results.push(this.repository.save(new DataEntity(data)));
        })
        .on('end', async () => {
          console.log('end');
          // resolve(null);
          // resolve(Promise.all(results));
          resolve(this.repository.save(results, { chunk: 100000 }));
        })
        .on('error', reject);
    });
    //   }
    // );
  }

  public async test() {
    await AppDataSource.initialize();
    console.log('starting');
    console.time('dbsave');
    await this.parse('./data/data0024.CSV');
    console.timeEnd('dbsave');
  }
}

new Parse().test();
