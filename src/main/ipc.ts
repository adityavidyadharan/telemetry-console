import { ipcMain } from 'electron';
import MappingService from './data/service/MappingService';
import ParseService from './data/service/ParseService';
import QueryService from './data/service/QueryService';
import SessionService from './data/service/SessionService';

ipcMain.handle('data:getSensor', async (_event, ...args) => {
  return new QueryService().get(args[0], args[1]);
});

ipcMain.handle('data:getDistinctMessages', async () => {
  return new QueryService().getDistinctMessages();
});

ipcMain.handle('data:getDistinctLabels', async (_event, ...args) => {
  return new QueryService().getDistinctLabels(args[0]);
});

ipcMain.handle('mappings:getCurrentMapping', async () => {
  return new MappingService().getCurrentMapping();
});

ipcMain.handle('mappings:updateMapping', async (_event, ...args) => {
  return new MappingService().updateMapping(args[0]);
});

ipcMain.handle('mappings:getMapping', async (_event, ...args) => {
  return new MappingService().getMapping(args[0], args[1]);
});

ipcMain.handle('mappings:validateMapping', async (_event, ...args) => {
  return new MappingService().validateMapping(args[0]);
});

ipcMain.handle('mappings:resetMapping', async () => {
  return new MappingService().reset();
});

ipcMain.handle('mappings:updateMappingFromFile', async (_event, ...args) => {
  return new MappingService().updateMappingFromFile(args[0]);
});

ipcMain.handle('parse:parse', async (_event, ...args) => {
  return new ParseService().parse(args[0], args[1]);
});

ipcMain.handle('parse:verify', async (_event, ...args) => {
  return new ParseService().verify(args[0]);
});

ipcMain.handle('session:getFileSize', async () => {
  return new SessionService().getFileSize();
});

ipcMain.handle('session:create', async (_event, ...args) => {
  return new SessionService().create(args[0]);
});

ipcMain.handle('session:edit', async (_event, ...args) => {
  return new SessionService().save(args[0]);
});

ipcMain.handle('session:delete', async (_event, ...args) => {
  return new SessionService().delete(args[0]);
});

ipcMain.handle('session:fetch', async () => {
  return new SessionService().fetch();
});

ipcMain.handle('session:select', async (_event, ...args) => {
  return new SessionService().select(args[0]);
});
