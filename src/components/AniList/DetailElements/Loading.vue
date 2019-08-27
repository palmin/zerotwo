<template>
  <v-layout fill-height align-center justify-center ma-0>
    <v-progress-circular indeterminate color="grey lighten-5" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {}
</script>
