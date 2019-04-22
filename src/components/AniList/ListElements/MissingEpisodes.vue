<template>
  <span class="info--text">
    {{ $tc('system.aniList.missingEpisodes', missingEpisodes, [missingEpisodes]) }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MissingEpisodes extends Vue {
  @Prop(Number)
  private missingEpisodes!: number;
}
</script>
