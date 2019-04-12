<template>
  <v-content>
    <v-layout row wrap fill-height>
      <template v-if="!item">
        <v-flex xs12>
          <v-layout
            fill-height
            align-center
            justify-center
            ma-0
          >
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-layout>
        </v-flex>
      </template>
      <template v-if="item">
        <v-flex xs12 v-if="item.bannerImage">
          <v-img :src="item.bannerImage" height="250px" position="50% 35%">
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
        </v-flex>
        <v-container>
          <v-layout row wrap>
            <v-flex xs3>
              <v-img :src="item.coverImage">
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
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
import API from '@/modules/AniList/API';
import { IAniListMedia } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DetailView extends Vue {
  private media: IAniListMedia | null = null;

  private get item() {
    if (!this.media) {
      return null;
    }

    return {
      title: this.media.title.userPreferred,
      bannerImage: this.media.bannerImage,
      coverImage: this.media.coverImage.extraLarge,
    };
  }

  private async created() {
    await appStore.setLoadingState(true);
    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      this.media = await API.getAnimeInfo(aniListId) as IAniListMedia;
      await aniListStore.setCurrentMediaTitle(this.media.title.userPreferred);
    } catch (error) {
      await appStore.setLoadingState(false);
      this.$router.back();
      return;
    }

    await appStore.setLoadingState(false);
  }
}
</script>

<style lang="scss" scoped>
.shadowed {
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}
</style>
