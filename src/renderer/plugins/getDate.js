import moment from 'moment';

const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      computed: {
        momentLocale() {
          if (!this.$i18n) {
            return this.locale;
          }

          return this.$i18n.locale;
        },
      },
      beforeMount() {
        // const locale = this.$i18n.locale || this.locale;
        moment.locale(this.momentLocale);
      },
      watch: {
        momentLocale(locale) {
          moment.locale(locale);
        },
      },
    });
    Vue.prototype.$moment = (...args) => moment(...args);
    Vue.prototype.$getMoment = (...args) => moment(...args);
    Vue.prototype.$getDate = (value, format) => moment(value).format(format);
  },
};

export default MyPlugin;
