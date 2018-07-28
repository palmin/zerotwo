<template>
  <div class="ui basic tab segment" data-tab="restoreFactoryData">
    <h2 class="ui header">
      {{ $t('system.settings.menu.restoreFactoryData') }}
    </h2>
    <div class="ui fluid primary button" @click="restoreFactoryData">
      {{ $t('system.settings.menu.restoreFactoryData') }}
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    restoreFactoryData() {
      // Logout currently covers all essential data
      // this.logout();
    },
  },
};
</script>
