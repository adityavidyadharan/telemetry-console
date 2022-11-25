import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  SessionModelInputType,
  SessionModelType,
} from './data/models/SessionModel';
import { Mapping } from './data/service/MappingService';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});

contextBridge.exposeInMainWorld('data', {
  ipcRenderer: {
    getSensor: (message: string, label: string) =>
      ipcRenderer.invoke('data:getSensor', message, label),
    getDistinctMessages: () => ipcRenderer.invoke('data:getDistinctMessages'),
    getDistinctLabels: (message: string) =>
      ipcRenderer.invoke('data:getDistinctLabels', message),
  },
});

contextBridge.exposeInMainWorld('mappings', {
  ipcRenderer: {
    getCurrentMapping: () => ipcRenderer.invoke('mappings:getCurrentMapping'),
    updateMapping: (mapping: Mapping) =>
      ipcRenderer.invoke('mappings:updateMapping', mapping),
    updateMappingFromFile: (path: string) =>
      ipcRenderer.invoke('mappings:updateMappingFromFile', path),
    getMapping: (message: string, label: string) =>
      ipcRenderer.invoke('mappings:getMapping', message, label),
    validateMapping: (mapping: Mapping) =>
      ipcRenderer.invoke('mappings:validateMapping', mapping),
    resetMapping: () => ipcRenderer.invoke('mappings:resetMapping'),
  },
});

contextBridge.exposeInMainWorld('parse', {
  ipcRenderer: {
    verify: (path: string) => ipcRenderer.invoke('parse:verify', path),
    parse: (path: string) => ipcRenderer.invoke('parse:parse', path),
    onChunk: (
      chunk: (data: number) => void,
      doneCB: (code: number) => void
    ) => {
      const chunkCB = (_event: IpcRendererEvent, data: number) => chunk(data);
      ipcRenderer.on('parse:chunk', chunkCB);
      ipcRenderer.on('parse:done', (_event: IpcRendererEvent, code: number) => {
        doneCB(code);
        ipcRenderer.removeListener('parse:chunk', chunkCB);
      });
    },
  },
});

contextBridge.exposeInMainWorld('session', {
  ipcRenderer: {
    create: (model: SessionModelInputType) =>
      ipcRenderer.invoke('session:create', model),
    edit: (model: SessionModelType) =>
      ipcRenderer.invoke('session:edit', model),
    delete: (id: number) => ipcRenderer.invoke('session:delete', id),
    select: (id: number) => ipcRenderer.invoke('session:select', id),
    fetch: () => ipcRenderer.invoke('session:fetch'),
  },
});
