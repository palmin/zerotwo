// import { spawn } from 'child_process';
// import os, { EOL } from 'os';
// import Log from '@/log';
// import { RPCClient, TransportTypes } from './rpc';

// const powershellCommand = 'Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object MainWindowTitle';
// const rpc = new RPCClient({ transport: TransportTypes.IPC });
// const validApps = ['mpv'];
// let openWindows: string[] = [];
// const errors: string[] = [];
// let timer: NodeJS.Timeout;

// /**
//  * @method mediaDetection
//  * @description Currently only supported by Windows!
//  * Returns errors and titles of currently opened windows
//  */
// export const mediaDetection = (): Promise<void> => {
//   if (os.platform() !== 'win32') {
//     return Promise.reject();
//   }

//   const childProcess = spawn('powershell.exe', ['-Command', powershellCommand]);

//   childProcess.stdout.on('data', (data: any) => {
//     const bufferData = Buffer.from(data).toString();
//     openWindows = bufferData.split(EOL);
//   });

//   childProcess.stderr.on('data', (data: any) => {
//     const bufferData = Buffer.from(data).toString();
//     errors.push(bufferData);
//   });

//   childProcess.stdin.end();

//   return Promise.resolve();
// };

// export const refreshRPC = async (): Promise<void> => {
//   try {
//     await mediaDetection();

//     if (errors.length) {
//       Log.log(Log.getErrorSeverity(), ['discord', 'mediaDetection'], errors.join('; '));
//     }

//     // Most likely, openWindows will at least contain ['MainWindowTitle', '-----------']
//     // which will result in an empty result.
//     if (openWindows.length < 3) {
//       return;
//     }

//     // Removes the first two elements.
//     openWindows.splice(0, 2);

//     const validWindows = openWindows.filter((openWindow) => {
//       const name = (openWindow.split(' - ').pop() as string).trim();
//       return validApps.find(validApp => validApp.toLowerCase() === name.toLowerCase());
//     });

//     if (!validWindows.length) {
//       return;
//     }

//     const validWindow: string = validWindows.shift() as string;
//     const windowNameParts = validWindow.split(' - ');
//     const programName = windowNameParts.pop();
//     const openedFilenameParts = windowNameParts.join(' - ').split('.');
//     const extension = openedFilenameParts.pop();
//     let openedFilename = openedFilenameParts.join('.');

//     // This pattern ignores all unnecessary data
//     const ignoringPattern = /(\[[\w+-_]+\])/gi;
//     // const episodePattern = /([0-9]+)/gi;

//     // Remove ignore patterns
//     openedFilename = openedFilename.replace(ignoringPattern, '').trim();
//     // const episode = openedFilename.match(episodePattern);

//     rpc.setActivity({
//       details: `Watching ${openedFilename}`,
//       state: `using ${programName}`,
//       startTimestamp: Math.floor(Date.now() / 1000),
//       endTimestamp: undefined,
//       largeImageKey: 'zerotwo',
//       smallImageKey: 'zerotwo',
//       largeImageText: `Watching ${openedFilename}`,
//       smallImageText: programName as string,
//       instance: false,
//     });
//   } catch (error) {
//     // not on windows
//     stopRPC();
//   }
// };

// export const startRPC = (): void => {
//   rpc.login({ clientId: process.env.VUE_APP_DISCORD_CLIENT_ID });

//   rpc.on('ready', () => {
//     refreshRPC();
//     timer = setInterval(refreshRPC, 60000);
//   });
// };

// export const stopRPC = async (): Promise<void> => {
//   await rpc.clearActivity();
//   rpc.logoff();
//   clearInterval(timer);
// };
