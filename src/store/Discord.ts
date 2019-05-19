import { action, getter, Module, mutation, VuexModule } from 'vuex-class-component';

import { mediaDetection, startRPC, stopRPC } from '@/discord';
import { RPCClient } from '@/discord/rpc';
import Log from '@/log';

@Module()
export class DiscordStore extends VuexModule {
  /**
   * @private
   * @var {string[]} _validMediaDetectionApps contains the names of all apps that the media detection should look for
   */
  private _validMediaDetectionApps: string[] = ['mpv'];
  /**
   * @private
   * @var {NodeJS.Timeout} _timer contains the timerId when the timer runs.
   * If the timer doesn't run, its value will be `null`.
   */
  private _timer: NodeJS.Timeout | null = null;
  /**
   * @private
   * @var {number} _refreshRate contains the amount of seconds until the app re-checks the currently opened windows
   */
  private _refreshRate: number = 60;
  /**
   * @private
   * @var {string[]} _openedWindows contains the currently opened windows
   */
  private _openedWindows: string[] = [];
  /**
   * @private
   * @var {boolean} _rpcActivated decides if the Discord RPC feature is activated
   */
  private _rpcActivated: boolean = false;

  private _rpcClient!: RPCClient;

  public get validMediaDetectionApps(): string[] {
    return this._validMediaDetectionApps;
  }

  public get refreshRate(): number {
    return this._refreshRate;
  }

  public get openedWindows(): string[] {
    return this._openedWindows;
  }

  public get isRPCActivated(): boolean {
    return this._rpcActivated;
  }

  @action()
  public async refreshRPC(): Promise<void> {
    if (!this.isRPCActivated || !this.validMediaDetectionApps.length) {
      return;
    }

    const { openWindows, errors } = mediaDetection();
    if (errors.length) {
      Log.log(Log.getErrorSeverity(), ['discord', 'store', 'mediaDetection'], errors.join('; '));
    }

    // Most likely, openWindows will at least contain ['MainWindowTitle', '-----------']
    // which will result in an empty result.
    if (openWindows.length < 3) {
      return;
    }

    // Removes the first two elements.
    openWindows.splice(0, 2);

    const validWindows = openWindows.filter((openWindow) => {
      const name = (openWindow.split(' - ').pop() as string).trim();
      return this.validMediaDetectionApps.find((validApp) =>
        validApp.toLowerCase() === name.toLowerCase());
    });

    if (!validWindows.length) {
      return;
    }

    const validWindow: string = validWindows.shift() as string;
    const windowNameParts = validWindow.split(' - ');
    const programName = windowNameParts.pop();
    const openedFilenameParts = windowNameParts.join(' - ').split('.');
    const extension = openedFilenameParts.pop();
    const openedFilename = openedFilenameParts.join('.');

    // This pattern ignores all unnecessary data
    const ignoringPattern = /(\[[\w+-_]+\])/gi;
    const episodePattern = /(episode|ep|e)?([0-9]+)/gi;

    // Remove ignore patterns
    openedFilename.replace(ignoringPattern, '').trim();
    const episode = openedFilename.match(episodePattern);

    this._rpcClient.setActivity({
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
  }
}

export const discordModule = DiscordStore.ExtractVuexModule(DiscordStore);
