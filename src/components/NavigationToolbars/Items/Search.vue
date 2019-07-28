<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn
        text
        icon
        :to="{ name: 'Search' }"
        v-on="{ ...toolTip }"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('system.actions.search') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {}
</script>
