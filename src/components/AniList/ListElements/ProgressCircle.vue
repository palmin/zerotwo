<template>
  <v-progress-circular class="episodeProgress" color="success" :value="progressPercentage" size="75" rotate="-90">
    <div class="episodeCount">{{ currentProgress }}</div>
    <div class="episodeDivider"></div>
    <div class="episodeAmount" :class="{ complete: completedList }">{{ episodeAmount }}</div>
    <v-btn class="episodeIncrease" v-if="!completedList" small flat icon color="success" @click="increaseEpisodeCounter"><v-icon size="18">mdi-plus</v-icon></v-btn>
  </v-progress-circular>
</template>

<script lang="ts">
import { AniListListStatus } from '@/modules/AniList/types';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProgressCircle extends Vue {
  @Prop(Number)
  private progressPercentage!: number;

  @Prop(Number)
  private currentProgress!: number;

  @Prop([Number, String])
  private episodeAmount!: number | string;

  @Prop(String)
  private status!: string;

  @Prop(Number)
  private entryId!: number;

  private get completedList(): boolean {
    return this.status === AniListListStatus.COMPLETED;
  }

  @Emit('increase')
  private increaseEpisodeCounter() {
    return this.entryId;
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
    top: -27px;
    left: -25px;
    z-index: 1;
    width: 50px;
    text-align: center;
  }

  .episodeDivider {
    font-size: 15pt;
    position: absolute;
    top: -18px;
    left: -5px;
    transform: scaleX(5);
    text-align: center;
    z-index: 2;

    &::before {
      content: '_';
    }
  }

  .episodeAmount {
    position: absolute;
    top: 7px;
    left: -25px;
    z-index: 3;
    text-align: center;
    width: 50px;
    transition: opacity ease-in-out 0.2s;
  }

  .episodeIncrease {
    position: absolute;
    top: 5px;
    left: -12.5px;
    width: 25px;
    height: 25px;
    z-index: 4;
    margin: 0;
    opacity: 0;
    transition: opacity ease-in-out 0.2s;
  }
}
</style>
