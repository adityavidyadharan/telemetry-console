import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
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
    getMapping: (message: string, label: string) =>
      ipcRenderer.invoke('mappings:getMapping', message, label),
    validateMapping: (mapping: Mapping) =>
      ipcRenderer.invoke('mappings:validateMapping', mapping),
    resetMapping: () => ipcRenderer.invoke('mappings:resetMapping'),
  },
});
