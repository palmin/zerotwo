<template>
  <v-toolbar-items>
    <v-text-field
      v-model="year"
      solo
      flat
      text
      :placeholder="currentYear"
      @keydown.enter="updateSeasonPreview"
    />

    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          {{ selectedSeason.title }}
          <v-icon right>
            mdi-menu-down
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in items" :key="index" @click="changeSelection(item)">
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom components
import eventBus from '@/eventBus';
import { AniListSeason } from '@/modules/AniList/types';

interface SeasonItemProperties {
  title: string;
  value: string;
}

@Component
export default class SeasonPreviewToolbar extends Vue {
  private year!: string;

  private items!: SeasonItemProperties[];

  private selectedSeason!: SeasonItemProperties;

  private get currentYear(): string {
    const date = new Date();

    return date.getFullYear().toString();
  }

  private created(): void {
    this.year = new Date().getUTCFullYear().toString();
    this.items = [{
      title: this.$t('seasons.winter').toString(),
      value: AniListSeason.WINTER,
    }, {
      title: this.$t('seasons.spring').toString(),
      value: AniListSeason.SPRING,
    }, {
      title: this.$t('seasons.summer').toString(),
      value: AniListSeason.SUMMER,
    }, {
      title: this.$t('seasons.fall').toString(),
      value: AniListSeason.FALL,
    }];

    const currentSeasonValue = this.getCurrentSeason();
    this.selectedSeason = this.items.find(item => item.value === currentSeasonValue) as SeasonItemProperties;
  }

  private changeSelection(item: SeasonItemProperties): void {
    this.selectedSeason = item;

    this.updateSeasonPreview();
  }

  private updateSeasonPreview(): void {
    // Full-width characters convert to half-width
    // @TODO: Move to a globally available library
    const input = this.year.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    // If the input is no number, replace it with the current year
    const year = parseInt(input, 10) || new Date().getUTCFullYear();

    // emit event that season has changed
    eventBus.$emit('updateSeason', {
      year,
      season: this.selectedSeason.value,
    });
  }

  private getCurrentSeason(): string {
    const currentMonth = new Date().getUTCMonth();

    // 0: January, 1: February, 2: March (Winter)
    // 3: April, 4: May, 5: June (Spring)
    // 6: July, 7: August, 8: September (Summer)
    // 9: October, 10: November, 11: December (Fall)

    return currentMonth >= 0 && currentMonth <= 2
      ? AniListSeason.WINTER
      : currentMonth >= 3 && currentMonth <= 5
        ? AniListSeason.SPRING
        : currentMonth >= 6 && currentMonth <= 8
          ? AniListSeason.SUMMER
          : AniListSeason.FALL;
  }
}
</script>
