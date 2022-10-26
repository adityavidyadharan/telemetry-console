import Store = require('electron-store');
import fs = require('fs');
import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import log from 'electron-log';
import { getAssetPath } from '../../util';

enum Charts {
  LINE,
  HEX,
}

export interface Label {
  live: Charts[];
  static: Charts;
}

export interface Message {
  [message: string]: { [label: string]: Label };
}

const schema = {
  type: 'object',
  patternProperties: {
    '\\w+': {
      type: 'object',
      patternProperties: {
        '\\w+': {
          type: 'object',
          properties: {
            live: {
              type: 'array',
            },
            static: {
              type: 'string',
            },
          },
          additionalProperties: false,
          required: ['live', 'static'],
        },
      },
    },
  },
  additionalProperties: false,
};

export default class MappingService {
  resource: string;

  store: Store<Message>;

  schema: ValidateFunction<unknown>;

  constructor() {
    this.schema = new Ajv().compile(schema);
    this.store = new Store<Message>();
    this.store.clear();
    this.resource = getAssetPath('mappings.json');
    if (this.store.size === 0) {
      this.loadDefaultMapping();
    }
  }

  private async loadDefaultMapping(): Promise<ErrorObject[] | null> {
    const raw = fs.readFileSync(this.resource).toString();
    const mapping = JSON.parse(raw);
    log.silly('Mapping', mapping);
    this.validateMapping(mapping);
    const status = this.validateMapping(mapping);
    if (status !== null && status !== undefined) return status;
    this.store.set(mapping);
    log.info('Loaded default mapping');
    return null;
  }

  public async getCurrentMapping() {
    return this.store.store;
  }

  public updateMapping(mapping: Message): ErrorObject[] | null {
    log.info('Updating mapping');
    log.silly('Mapping', mapping);
    const status = this.validateMapping(mapping);
    if (status !== null && status !== undefined) return status;
    this.store.clear();
    this.store.set(mapping);
    log.info('Updated mapping');
    return null;
  }

  public validateMapping(mapping: Message): ErrorObject[] | null | undefined {
    if (this.schema(mapping)) {
      return null;
    }
    log.debug('Error in mapping');
    log.debug(this.schema.errors);
    return this.schema.errors;
  }

  public getMapping(message: string, label: string): Label | undefined {
    return this.store.get(message)?.[label];
  }
}
