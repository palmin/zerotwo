<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ $t('system.settings.title') }}</div>
    <div class="content">
      <div class="ui grid">
        <div class="four wide column">
          <tab-menu :malDisabled="malDisabled" />
        </div>

        <div class="twelve wide column">
          <app-settings />
          <my-anime-list v-if="!malDisabled" />
          <ani-list />
          <restore-factory-data />
          <about-zero-two />
          <special-thanks />
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui button" @click="close">{{ $t('system.actions.close') }}</div>
    </div>
  </div>
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
    return { malDisabled: true };
  },
  mounted() {
    $('.ui.fluid.secondary.vertical.menu .item').tab();
  },
  methods: {
    close() {
      $(this.$el)
        .modal('hide');
    },
    show() {
      $(this.$el)
        .modal({
          closable: false,
          centered: false,
          autofocus: false,
        })
        .modal('show');
    },
  },
};
</script>
