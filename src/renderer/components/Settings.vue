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
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon dark @click.native="dialog = false">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('system.settings.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark flat @click.native="dialog = false">{{ $t('system.actions.save') }}</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-navigation-drawer permanent dark>
          <tab-menu :malDisabled="malDisabled" />
        </v-navigation-drawer>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import TabMenu from './Settings/TabMenu';
import AppSettings from './Settings/AppSettings';
import MyAnimeList from './Settings/MyAnimeList';
import RestoreFactoryData from './Settings/RestoreFactoryData';
import AniList from './Settings/AniList';
import AboutZeroTwo from './Settings/AboutZeroTwo';
import SpecialThanks from './Settings/SpecialThanks';

export default {
  components: {
    TabMenu,
    SpecialThanks,
    AppSettings,
    MyAnimeList,
    RestoreFactoryData,
    AniList,
    AboutZeroTwo,
  },
  data() {
    return { malDisabled: true, dialog: false };
  },
  mounted() {
    // $('.ui.fluid.secondary.vertical.menu .item').tab();
  },
  methods: {
    close() {
      // $(this.$el)
      //   .modal('hide');
    },
    show() {
      // $(this.$el)
      //   .modal({
      //     closable: false,
      //     centered: false,
      //     autofocus: false,
      //   })
      //   .modal('show');
    },
  },
};
</script>
