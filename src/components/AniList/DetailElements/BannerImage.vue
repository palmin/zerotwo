<template>
  <v-img :src="item.bannerImage" height="250px" position="50% 35%">
    <template v-slot:placeholder>
      <v-layout fill-height align-center justify-center ma-0>
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-layout>
    </template>
  </v-img>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class BannerImage extends Vue {
  @Prop()
  private item!: any;
}
</script>
