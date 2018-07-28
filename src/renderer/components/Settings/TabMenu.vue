<template>
  <div class="ui fluid secondary vertical menu">
    <a class="active item" data-tab="appSettings">
      {{ $t('system.settings.menu.appSettings') }}
    </a>
    <a class="item" :class="{ disabled: malDisabled }" data-tab="myAnimeList">
      {{ $t('system.settings.menu.myAnimeList') }}
    </a>
    <a class="item" data-tab="aniList">
      {{ $t('system.settings.menu.aniList') }}
    </a>
    <a class="item" data-tab="restoreFactoryData">
      {{ $t('system.settings.menu.restoreFactoryData') }}
    </a>
    <a class="item" data-tab="aboutZeroTwo">
      {{ $t('system.settings.menu.aboutZeroTwo') }}
    </a>
    <a class="item" data-tab="specialThanks">
      {{ $t('system.settings.menu.specialThanks') }}
    </a>
  </div>
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
};
</script>


