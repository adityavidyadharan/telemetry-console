import { ErrorObject } from 'ajv';
import { DataModelType } from '../main/data/models';
import { Mapping } from '../main/data/service/MappingService';
import { Channels } from '../main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    data: {
      ipcRenderer: {
        getSensor(message: string, label: string): Promise<DataModelType[]>;
        getDistinctMessages(): Promise<string[]>;
        getDistinctLabels(message: string): Promise<string[]>;
      };
    };
    mappings: {
      ipcRenderer: {
        getCurrentMapping(): Promise<Mapping>;
        updateMapping(mapping: Mapping): Promise<void>;
        getMapping(message: string, label: string): Promise<Mapping>;
        validateMapping(mapping: Mapping): Promise<ErrorObject[]>;
        resetMapping(): Promise<void>;
      };
    };
  }
}

export {};
