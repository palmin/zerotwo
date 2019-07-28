<template>
  <span
    v-if="nextEpisode"
    class="success--text"
  >{{ nextEpisode }}</span>
  <span
    v-else-if="status === 'FINISHED'"
    class="info--text"
  >{{ $t('system.aniList.airingFinished') }}</span>
  <span
    v-else-if="status === 'NOT_YET_RELEASED'"
    class="info--text"
  >{{ $t('system.aniList.notYetAired') }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpisodeState extends Vue {
  @Prop(String)
  private nextEpisode!: string | null;

  @Prop(String)
  private status!: string;
}
</script>
