module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/electron/background.ts',
      productName: 'ZeroTwo',
      appId: 'org.nicoaiko.zerotwo',
      directories: {
        output: 'build'
      },
      files: ['dist/electron/**/*'],
      nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true
      },
      dmg: {
        contents: [
          {
            x: 410,
            y: 150,
            type: "link",
            path: "/Applications"
          },
          {
            x: 130,
            y: 150,
            type: "file"
          }
        ]
      },
      mac: {
        icon: "build/icons/ZeroTwo.icns"
      },
      win: {
        icon: "build/icons/ZeroTwo.ico",
        target: [
          {
            target: "nsis",
            arch: [
              "x64",
              "ia32"
            ]
          }
        ]
      },
      linux: {
        icon: "build/icons",
        target: [
          "AppImage",
          "deb",
          "snap",
          "tar.gz"
        ]
      }
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
