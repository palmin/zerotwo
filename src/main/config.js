require('dotenv').config();

module.exports = {
  sources: {
    repoUrl: 'https://github.com/NicoAiko/zerotwo',
  },
  oauth: {
    clientId: process.env.CLIENT_ID || '533',
    clientSecret: process.env.CLIENT_SECRET || 'AND_HERE',
    authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
    tokenUrl: 'https://anilist.co/api/v2/oauth/token',
    useBasicAuthorizationHeader: true,
    // don't touch me
    redirectUri: 'http://localhost/',
  },
};
