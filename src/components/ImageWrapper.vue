<template>
  <v-layout>
    <v-img :height="height" :src="`data:image/jpg;base64,${imageLink}`">
      <template v-slot:placeholder>
        <v-layout
          fill-height
          align-center
          justify-center
          ma-0
        >
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-layout>
      </template>
    </v-img>
  </v-layout>
</template>

<script lang="ts">
import FS, { readFileSync } from 'fs';
import { Component, Prop, Vue } from 'vue-property-decorator';

// Custom Components
import { AniListImageSize } from '@/modules/AniList/types';
import { aniListStore } from '@/store';

@Component
export default class ImageWrapper extends Vue {
  @Prop(String)
  private readonly originalLink!: string;

  @Prop(String)
  private readonly size!: string;

  @Prop(Number)
  private readonly aniListId!: number | null;

  @Prop(String)
  private readonly height?: string = undefined;

  private imageLink: string = '';

  private async mounted() {
    const imageLink = await this.getImageLink();

    this.imageLink = imageLink;
  }

  private async getImageLink(): Promise<string> {
    const image = await aniListStore.searchImage({
      aniListId: this.aniListId,
      originalLink: this.originalLink,
      size: this.size,
    });

    // Available, return path
    if (image) {
      return FS.readFileSync(image.path).toString('base64');
    }

    // Not yet available, add to storage
    const imagePath = await aniListStore.addImageToStorage({
      aniListId: this.aniListId,
      originalLink: this.originalLink,
      size: this.size,
    });

    return FS.readFileSync(imagePath).toString('base64');
  }
}
</script>
