<template>
  <v-tabs dark v-model="active">
    <v-tab v-for="tab in tabs" :key="tab.key" ripple>
      {{ tab.value }}
    </v-tab>
  </v-tabs>
</template>

<script>
export default {
  props: {
    malDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: ({
    tabs: [{
      key: 'appSettings',
      value: this.$t('system.settings.menu.appSettings'),
    }, {
      key: 'myAnimeList',
      value: this.$t('system.settings.menu.myAnimeList'),
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
    }],
  }),
};
</script>


