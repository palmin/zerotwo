<template>
  <v-card class="d-flex">
    <v-img :src="coverImage">
      <template v-slot:placeholder>
        <v-row align="center" justify="center" ma-0>
          <v-progress-circular indeterminate color="grey lighten-5" />
        </v-row>
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
