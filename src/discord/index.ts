import { spawn } from 'child_process';
import os, { EOL } from 'os';
import { RPCClient, TransportTypes } from './rpc';

const powershellCommand = 'Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object MainWindowTitle';
const rpc = new RPCClient({ transport: TransportTypes.IPC });

/**
 * @method mediaDetection
 * @description Currently only supported by Windows!
 * Returns errors and titles of currently opened windows
 */
export const mediaDetection = (): { openWindows: string[], errors: string[] } => {
  if (os.platform() !== 'win32') {
    return { openWindows: [], errors: [] };
  }

  const childProcess = spawn('powershell.exe', ['-Command', powershellCommand]);
  let openWindows: string[] = [];
  const errors: string[] = [];

  childProcess.stdout.on('data', (data: any) => {
    const bufferData = Buffer.from(data).toString();
    openWindows = openWindows.concat(bufferData.split(EOL));
  });

  childProcess.stderr.on('data', (data: any) => {
    const bufferData = Buffer.from(data).toString();
    errors.push(bufferData);
  });

  childProcess.stdin.end();

  return { openWindows, errors };
};

export const startRPC = (): void => {
  rpc.login({ clientId: process.env.VUE_APP_DISCORD_CLIENT_ID });

  rpc.on('ready', () => {
    rpc.setActivity({
      details: 'Test Details',
      state: 'State Test',
      startTimestamp: Math.floor(Date.now() / 1000),
      endTimestamp: undefined,
      largeImageKey: 'zerotwo',
      smallImageKey: 'zerotwo',
      largeImageText: 'Large Text',
      smallImageText: 'Small Text',
      instance: false,
    });
  });
};

export const stopRPC = async (): Promise<void> => {
  await rpc.clearActivity();
  rpc.logoff();
};
