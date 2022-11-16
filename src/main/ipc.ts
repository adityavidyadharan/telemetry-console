import { ipcMain } from 'electron';
import MappingService from './data/service/MappingService';
import ParseService from './data/service/ParseService';
import QueryService from './data/service/QueryService';

ipcMain.handle('data:getSensor', async (_event, ...args) => {
  return new QueryService('data').get(args[0], args[1]);
});

ipcMain.handle('data:getDistinctMessages', async () => {
  return new QueryService('data').getDistinctMessages();
});

ipcMain.handle('data:getDistinctLabels', async (_event, ...args) => {
  return new QueryService('data').getDistinctLabels(args[0]);
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
  return new ParseService().parse(args[0]);
});
