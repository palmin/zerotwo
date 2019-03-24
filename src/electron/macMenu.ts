import { app, Menu, shell } from 'electron';
import os from 'os';
import { version } from '../../package.json';

export default () => Menu.buildFromTemplate([
  {
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'GitHub Issue Tracker',
        click() {
          shell.openExternal('https://github.com/NicoAiko/zerotwo/issues');
        },
      },
      {
        label: 'Create a Bug Issue on GitHub',
        click() {
          const content = encodeURIComponent(`# BUG REPORT\n\n*Please specify the bug you want to report.*\n\n___\n\nZeroTwo v${version}\n\n${os.platform()} ${os.release()}`); // tslint:disable-line max-line-length
          const url = `https://github.com/NicoAiko/zerotwo/issues/new?labels=bug🐞&body=${content}`;
          shell.openExternal(url);
        },
      },
      {
        label: 'ZeroTwo Homepage',
        click() {
          shell.openExternal('https://www.zerotwo.org');
        },
      },
    ],
  },
]);
