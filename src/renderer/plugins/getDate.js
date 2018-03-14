import moment from 'moment';

const MyPlugin = {
  install(Vue) {
    Vue.mixin({
      beforeMount() {
        const locale = this.$i18n.locale || this.locale;
        moment.locale(locale);
      },
    });
    Vue.prototype.$getMoment = (...args) => moment(...args);
    Vue.prototype.$getDate = (value, format) => moment(value).format(format);
  },
};

export default MyPlugin;
