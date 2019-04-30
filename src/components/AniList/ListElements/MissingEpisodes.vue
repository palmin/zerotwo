<template>
  <span class="info--text" v-if="missingEpisodes">
    {{ $tc('system.aniList.missingEpisodes', missingEpisodes, [missingEpisodes]) }}
  </span>
</template>

<script lang="ts">
import { IAniListEntry, IAniListNextAiringEpisode } from '@/modules/AniList/types';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MissingEpisodes extends Vue {
  @Prop(Object)
  private nextAiringEpisode!: IAniListNextAiringEpisode;

  @Prop(Number)
  private currentProgress!: number;

  private get missingEpisodes(): number {
    const { currentProgress, nextAiringEpisode } = this;

    if (!nextAiringEpisode) {
      return 0;
    }

    const nextEpisode = nextAiringEpisode.episode;

    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - currentProgress > 0
      ? nextEpisode - 1 - currentProgress
      : 0;
  }
}
</script>
