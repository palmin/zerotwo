module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/electron/background.ts'
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'assets/locales',
      enableInSFC: false
    }
  },
  chainWebpack: (config) => {
    config.devtool('source-map');
    config.module.rule('ts')
      .use('tslint-loader')
      .loader('tslint-loader');
    
  },
};
