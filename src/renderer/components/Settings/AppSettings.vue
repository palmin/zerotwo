<template>
  <div class="ui active basic tab segment" data-tab="appSettings">
    <h2 class="ui header">
      {{ $t('system.settings.appSettings.setAppLanguage') }}
    </h2>
    <div class="ui grid">
      <div class="seven wide column">
        <div class="ui fluid selection dropdown">
          <input type="hidden">
          <i class="dropdown icon"></i>
          <div class="default text">{{ $t('system.settings.appSettings.chooseLanguage') }}</div>
          <div class="menu">
            <div class="item" v-for="language in languages" :key="language.value" :data-value="language.value">
              <span class="description">{{ language.englishName }}</span>
              <span class="text">{{ language.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="four wide column">
        <button class="ui fluid primary button" @click="submitLanguageChange">
          {{ $t('system.settings.appSettings.changeLanguage') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  computed: { ...mapState('i18n', ['locale']) },
  watch: {
    locale(locale) {
      this.localeSetting = locale;
      $('.ui.selection.dropdown', this.$el)
        .dropdown('set selected', this.locale);
    },
  },
  mounted() {
    $('.ui.selection.dropdown', this.$el)
      .dropdown({ onChange: this.changeLanguageValue });
  },
  methods: {
    ...mapMutations('i18n', ['setLocale']),
    submitLanguageChange() {
      this.setLocale(this.localeSetting);
    },
    changeLanguageValue(value) {
      this.localeSetting = value;
    },
  },
  data() {
    return {
      localeSetting: '',
      languages: [{
        name: 'English',
        englishName: 'English',
        value: 'en',
      }, {
        name: 'Deutsch',
        englishName: 'German',
        value: 'de',
      }, {
        name: '日本語',
        englishName: 'Japanese',
        value: 'ja',
      }, {
        name: '简体中文',
        englishName: 'Simplified Chinese',
        value: 'zh-cn',
      }],
    };
  },
};
</script>
