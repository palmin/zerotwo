<template>
  <v-card>
    <v-img :src="coverImage">
      <template v-slot:placeholder>
        <v-layout fill-height align-center justify-center ma-0>
          <v-progress-circular indeterminate color="grey lighten-5" />
        </v-layout>
      </template>
    </v-img>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CoverImage extends Vue {
  @Prop()
  private coverImage!: string;
}
</script>
