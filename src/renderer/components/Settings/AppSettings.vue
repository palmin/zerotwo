<template>
  <v-tab-item key="appSettings">
    <v-card flat>
      <v-container fluid>
        <v-flex xs6>
          <v-select
          :items="languages"
          item-text="name"
          v-model="localeSetting"
          :label="$t('system.settings.appSettings.chooseLanguage')"
          ></v-select>
          <v-btn dark color="primary" @click="submitLanguageChange">
            {{ $t('system.settings.appSettings.changeLanguage') }}
          </v-btn>
        </v-flex>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  computed: { ...mapState('i18n', ['locale']) },
  watch: {
    locale(locale) {
      this.localeSetting = locale;
    },
  },
  methods: {
    ...mapMutations('i18n', ['setLocale']),
    submitLanguageChange() {
      this.setLocale(this.localeSetting);
    },
  },
  data() {
    return {
      localeSetting: '',
      languages: [{
        name: 'العَرَبِيَّة‎',
        englishName: 'Arabic',
        value: 'ar',
      }, {
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
        value: 'zh',
      }],
    };
  },
};
</script>
