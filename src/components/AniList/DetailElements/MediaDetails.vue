<template>
  <v-card>
    <v-list dense two-line>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.romajiTitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.nativeTitle }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.nativeTitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.englishTitle }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.englishTitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.episodes }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.episodes') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="item.synonyms">
        <v-list-item-content>
          <v-list-item-title>{{ item.synonyms }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.synonyms') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="item.genres">
        <v-list-item-content>
          <v-list-item-title>{{ item.genres }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.genres') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.airingTime }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.airingTime') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ $t('pages.aniList.detailView.score', [item.score, 100]) }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('pages.aniList.detailView.scoreLabel') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="item.isAdult" color="red">
        <v-list-item-content>
          <v-list-item-title>{{ $t('pages.aniList.detailView.adult') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MediaDetails extends Vue {
  @Prop()
  private item!: any;
}
</script>
