<template>
  <v-card>
    <v-list dense two-line>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.romajiTitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.nativeTitle }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.nativeTitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.englishTitle }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.englishTitle') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.episodes }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.episodes') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="item.synonyms">
        <v-list-item-content>
          <v-list-item-title>{{ item.synonyms }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.synonyms') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="item.genres">
        <v-list-item-content>
          <v-list-item-title>{{ item.genres }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.genres') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ item.airingTime }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.airingTime') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ $t('detailView.score', [item.score, 100]) }}</v-list-item-title>
          <v-list-item-subtitle>{{ $t('detailView.scoreLabel') }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="item.isAdult" color="red">
        <v-list-item-content>
          <v-list-item-title>{{ $t('detailView.adult') }}</v-list-item-title>
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
