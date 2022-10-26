/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import log, { LogMessage } from 'electron-log';
import chalk from 'chalk';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getDataPath() {
  return process.env.NODE_ENV !== 'production' ? '.' : app.getPath('userData');
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export function setLog() {
  log.transports.file.resolvePath = () =>
    path.join(getDataPath(), 'logs/main.log');
  log.transports.file.level =
    process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  log.transports.console.level = 'debug';
  log.transports.console.format = (message: LogMessage, _data: unknown) => {
    const str = `[${message.date.toUTCString()}] ${`[${message.level}]`.padEnd(
      9,
      ' '
    )} `;
    if (message.level === 'error') return chalk.bgRed(str) + message.data;
    if (message.level === 'warn') return chalk.red(str) + message.data;
    if (message.level === 'info') return chalk.cyan(str) + message.data;
    if (message.level === 'debug') return chalk.green(str) + message.data;
    if (message.level === 'verbose') return chalk.bgBlack(str) + message.data;
    return chalk.white(str);
  };
  log.transports.console.useStyles = true;
}
