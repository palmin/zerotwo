<template>
  <v-progress-circular class="episodeProgress" color="success" :value="progressPercentage" :indeterminate="indeterminate" size="75" rotate="-90">
    <div class="episodeCount">{{ currentProgress }}</div>
    <div class="episodeDivider"></div>
    <div class="episodeAmount" :class="{ complete: completedList }">{{ episodeAmount }}</div>
    <v-btn class="episodeIncrease" v-if="!completedList" small text icon color="success" @click="increaseEpisodeCounter"><v-icon size="18">mdi-plus</v-icon></v-btn>
  </v-progress-circular>
</template>

<script lang="ts">
import { AniListListStatus } from '@/modules/AniList/types';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

type AlphaNumerical = number | string;

@Component
export default class ProgressCircle extends Vue {
  private indeterminate: boolean = false;

  private get completedList(): boolean {
    return this.status === AniListListStatus.COMPLETED;
  }

  @Prop(Number)
  private progressPercentage!: number;

  @Prop(Number)
  private currentProgress!: number;

  @Prop(Number)
  private entryId!: number;

  @Prop(String)
  private status!: string;

  @Prop([Number, String])
  private episodeAmount!: AlphaNumerical;

  @Emit('increase')
  private increaseEpisodeCounter() {
    this.indeterminate = true;
    return this.entryId;
  }

  @Watch('currentProgress')
  private onCurrentProgressChange() {
    this.indeterminate = false;
  }
}
</script>

<style lang="scss" scoped>
.episodeProgress {
  &:hover {
    & .episodeAmount:not(.complete) {
      opacity: 0;
    }

    & .episodeIncrease {
      opacity: 1;
    }
  }

  .episodeCount {
    font-size: 15pt;
    position: absolute;
    top: 15px;
    left: 12px;
    z-index: 1;
    width: 50px;
    text-align: center;
  }

  .episodeDivider {
    font-size: 15pt;
    position: absolute;
    top: 23px;
    left: 33px;
    transform: scaleX(5);
    text-align: center;
    z-index: 2;

    &::before {
      content: '_';
    }
  }

  .episodeAmount {
    position: absolute;
    top: 44px;
    left: 12px;
    z-index: 3;
    text-align: center;
    width: 50px;
    transition: opacity ease-in-out 0.2s;
  }

  .episodeIncrease {
    position: absolute;
    top: 44px;
    left: 24px;
    width: 25px;
    height: 25px;
    z-index: 4;
    margin: 0;
    opacity: 0;
    transition: opacity ease-in-out 0.2s;
  }
}
</style>
