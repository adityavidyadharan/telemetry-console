import { ipcMain } from 'electron';
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
