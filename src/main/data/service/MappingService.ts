import Store = require('electron-store');
import fs = require('fs');
import Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import log from 'electron-log';
import { getAssetPath } from '../../util';

enum Charts {
  LINE = 'line',
  HEX = 'hex',
  DISCRETE = 'discrete',
  BOOLEAN = 'boolean',
}

export interface Label {
  live: Charts[];
  static: Charts;
}

export interface Mapping {
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
              items: {
                type: 'string',
                enum: Object.values(Charts) as Charts[],
              },
            },
            static: {
              type: 'string',
              enum: Object.values(Charts),
            },
          },
          additionalProperties: false,
        },
      },
    },
  },
  additionalProperties: false,
};

class ValidationError extends Error {
  constructor(message: string, public errors: ErrorObject[]) {
    super(message);
    this.errors = errors;
  }
}

export default class MappingService {
  resource: string;

  store: Store<Mapping>;

  schema: ValidateFunction<unknown>;

  constructor() {
    this.schema = new Ajv().compile(schema);
    this.store = new Store<Mapping>();
    this.resource = getAssetPath('mappings.json');
    if (this.store.size === 0) {
      this.loadDefaultMapping();
    }
  }

  public reset() {
    this.store.clear();
    this.loadDefaultMapping();
  }

  private loadDefaultMapping(): ErrorObject[] | null {
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

  public getCurrentMapping() {
    return this.store.store;
  }

  public updateMapping(mapping: Mapping): ErrorObject[] | null {
    log.info('Updating mapping');
    log.silly('Mapping', mapping);
    const status = this.validateMapping(mapping);
    if (status !== null && status !== undefined)
      throw new ValidationError('Invalid mapping', status);
    this.store.clear();
    this.store.set(mapping);
    log.info('Updated mapping');
    return null;
  }

  public validateMapping(mapping: Mapping): ErrorObject[] | null | undefined {
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
