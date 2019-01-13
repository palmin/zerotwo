// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcMain, BrowserWindow } from 'electron';
import nodeUrl from 'url';
import request from 'request';
import { oauth as oauthConfig } from './config';

const windowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  webPreferences: { nodeIntegration: false },
  show: false,
};

/* eslint-disable no-case-declarations */
ipcMain.on('aniList-oauth', (event, action, refreshToken) => {
  switch (action) {
    case 'getToken':
      const redirectUri = encodeURIComponent(oauthConfig.redirectUri);
      const url = `${oauthConfig.authorizationUrl}?client_id=${oauthConfig.clientId}&response_type=code&redirect_uri=${redirectUri}`;

      const window = new BrowserWindow(windowParams);
      window.loadURL(url);
      window.once('ready-to-show', () => {
        window.show();

        const oauthFunction = (windowEvent, url) => {
          const params = nodeUrl.parse(url, true);
          if (!params.query || !params.query.code) {
            return;
          }

          const { code } = params.query;
          const tokenRequestOptions = {
            uri: oauthConfig.tokenUrl,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            json: {
              grant_type: 'authorization_code',
              client_id: oauthConfig.clientId,
              client_secret: oauthConfig.clientSecret,
              redirect_uri: oauthConfig.redirectUri,
              code,
            },
          };

          request(tokenRequestOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
              event.sender.send('aniList-oauth-reply', { access_token: body.access_token, refresh_token: body.refresh_token }, code);
              try {
                window.close();
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Couldn't be closed! See error: ${error.message}`);
              }
            } else {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          });
        };

        window.webContents.on('will-navigate', (windowEvent, url) => oauthFunction(windowEvent, url));
        window.webContents.on('will-redirect', (windowEvent, url) => oauthFunction(windowEvent, url));
        window.webContents.on('did-get-redirect-request', (windowEvent, oldUrl, newUrl) => oauthFunction(windowEvent, newUrl));
      });

      break;

    case 'refreshToken':
      const tokenRequestOptions = {
        uri: 'https://anilist.co/api/v2/oauth/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        json: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          redirect_uri: oauthConfig.redirectUri,
        },
      };

      request(tokenRequestOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          event.sender.send('aniList-oauth-refresh', body.refresh_token);
        }
      });
      break;
    default: break;
  }
/* eslint-enable no-case-declarations */
});
