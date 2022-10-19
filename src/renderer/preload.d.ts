import { Channels } from 'main/preload';
import { DataModelType } from '../main/data/models';

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
  }
}

export {};
