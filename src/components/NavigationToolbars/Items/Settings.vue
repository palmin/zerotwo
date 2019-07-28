<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn
        text
        exact
        icon
        :to="{ name: 'Settings' }"
        v-on="{ ...toolTip }"
      >
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('menu.settings') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Settings extends Vue {}
</script>
