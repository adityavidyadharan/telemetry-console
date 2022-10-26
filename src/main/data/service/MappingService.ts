import Store = require('electron-store');
import path = require('path');
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
    if (this.store.size === 0) {
      this.loadDefaultMapping();
    }
    this.resource = getAssetPath('mappings.json');
  }

  private async loadDefaultMapping(): Promise<ErrorObject[] | null> {
    const mappings = await import(getAssetPath('mappings.json'));
    this.validateMapping(mappings);
    const status = this.validateMapping(mappings);
    if (status !== null && status !== undefined) return status;
    this.store.set(mappings);
    log.info('Loaded default mapping');
    return null;
  }

  public validateMapping(mapping: Message): ErrorObject[] | null | undefined {
    if (this.schema(mapping)) {
      return null;
    }
    log.debug('Error in mapping');
    return this.schema.errors;
  }

  public getMapping(message: string, label: string): Label | undefined {
    return this.store.get(message)?.[label];
  }
}

new MappingService();
