<template>
  <v-toolbar app fixed dark flat dense>
    <v-menu offset-y>
      <v-btn flat dark slot="activator">
        <v-icon left>mdi-menu</v-icon>
        {{ $t('system.modules.aniList') }}
      </v-btn>
    </v-menu>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn flat exact :to="{ name: 'Home' }">{{ $t('menu.home') }}</v-btn>
      <v-btn flat exact :to="{ name: 'Watching' }">{{ $t('menu.watching') }}</v-btn>
      <v-btn flat exact :to="{ name: 'Settings' }">{{ $t('menu.settings') }}</v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Navigation extends Vue {}
</script>
