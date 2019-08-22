<template>
  <v-layout align-start justify-start>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon class="pointerCursor" color="error" v-on="on">
          mdi-alert
        </v-icon>
      </template>
      <span>{{ $t('system.alerts.adultContent') }}</span>
    </v-tooltip>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AdultTooltip extends Vue {}
</script>
