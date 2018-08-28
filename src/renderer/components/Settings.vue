<template>
  <v-dialog
    v-model="dialog"
    scrollable fullscreen
    persistent :overlay="false"
    transition="scale-transition"
    origin="bottom center 0"
  >
    <v-btn dark flat icon slot="activator">
      <v-icon>fas fa-cog</v-icon>
    </v-btn>
    <v-card dark>
      <v-toolbar color="primary" dark>
        <v-btn icon dark @click.native="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('system.settings.title') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-tabs grow fluid dark>
          <v-tab v-for="tab in tabs" :key="tab.key" ripple>
            {{ tab.value }}
          </v-tab>
          <v-tabs-items>
            <app-settings />
            <my-anime-list />
            <ani-list />
            <!--<restore-factory-data />
            <about-zero-two />
            <special-thanks /> -->
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import AppSettings from './Settings/AppSettings';
import MyAnimeList from './Settings/MyAnimeList';
import RestoreFactoryData from './Settings/RestoreFactoryData';
import AniList from './Settings/AniList';
import AboutZeroTwo from './Settings/AboutZeroTwo';
import SpecialThanks from './Settings/SpecialThanks';

export default {
  components: {
    SpecialThanks,
    AppSettings,
    MyAnimeList,
    RestoreFactoryData,
    AniList,
    AboutZeroTwo,
  },
  computed: {
    tabs() {
      return [{
        key: 'appSettings',
        value: this.$t('system.settings.menu.appSettings'),
      }, {
        key: 'myAnimeList',
        value: this.$t('system.settings.menu.myAnimeList'),
        disabled: true,
      }, {
        key: 'aniList',
        value: this.$t('system.settings.menu.aniList'),
      }, {
        key: 'restoreFactoryData',
        value: this.$t('system.settings.menu.restoreFactoryData'),
      }, {
        key: 'aboutZeroTwo',
        value: this.$t('system.settings.menu.aboutZeroTwo'),
      }, {
        key: 'specialThanks',
        value: this.$t('system.settings.menu.specialThanks'),
      }];
    },
  },
  data() {
    return {
      malDisabled: true,
      dialog: false,
    };
  },
  methods: {
    close() {
      this.dialog = false;
    },
  },
};
</script>
