<template>
  <div class="ui basic tab segment" data-tab="specialThanks">
    <h2 class="ui center aligned icon header">
      <i class="users icon"></i>
      {{ $t('system.settings.menu.specialThanks') }}
    </h2>
    <div class="ui list">
      <div class="item" v-for="contributor in contributors" :key="contributor.name">
        <i :class="contributor.icon"></i>
        <div class="content">
          <div class="header">{{ contributor.name }}</div>
          <div class="description">{{ contributor.thanks }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contributors: [
        {
          name: '晨风Mornwind',
          thanks: 'for providing the Simplified Chinese localization.',
          icon: 'user icon',
        },
      ],
    };
  },
};
</script>

