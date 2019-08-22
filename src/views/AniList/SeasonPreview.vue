<template>
  <v-content>
    <v-container fluid class="py-0 px-1" fill-height>
      <v-layout wrap>
        <v-flex
          v-for="item in preparedMedia"
          :key="item.id"
          xs3
          lg3
          xl2
        >
          <v-card hover class="ma-1">
            <ListImage :image-link="item.coverImage" :name="item.name" :ani-list-id="item.id" />

            <v-card-text>
              <v-layout row fill-height align-center>
                <v-layout column class="px-2" justify-start>
                  <v-flex class="subtitle-1 grey--text">
                    {{ $tc('seasonPreview.episodes', item.episodes) }}
                  </v-flex>
                  <v-flex class="subtitle-1 grey--text">
                    {{ $t('seasonPreview.startDate') }} {{ item.startDate }}
                  </v-flex>
                </v-layout>

                <template v-if="item.isAdult">
                  <v-flex class="mx-2 text-right">
                    <v-divider vertical inset />

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon large color="error" v-on="on">
                          mdi-alert
                        </v-icon>
                      </template>
                      <span>{{ $t('system.alerts.adultContent') }}</span>
                    </v-tooltip>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn
                block
                text
                :disabled="item.isLocked || item.inList"
                :loading="appLoading"
                @click="addMediaToPlanList(item)"
              >
                <v-icon left color="success">
                  mdi-library-plus
                </v-icon>
                {{ $t('system.actions.addToPlanToWatch') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex v-if="!preparedMedia.length" xs12 text-center class="display-2 ma-4">
          {{ $t('$vuetify.noDataText') }}
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { chain } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import eventBus from '@/eventBus';
import Log from '@/log';
import API from '@/modules/AniList/API';
import {
  AniListListStatus, AniListSeason, IAniListEntry, IAniListSeasonPreviewMedia,
} from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';

interface UpdateSeasonProperties {
  year: number;
  season: AniListSeason;
}

@Component({ components: { ListImage } })
export default class SeasonPreview extends Vue {
  private media: IAniListSeasonPreviewMedia[] = [];

  private seasonYear: number = new Date().getUTCFullYear();

  private season: AniListSeason = this.getCurrentSeason();

  private get appLoading(): boolean {
    return appStore.isLoading;
  }

  private get preparedMedia() {
    return chain(this.media)
      .filter(item => !item.isAdult || (item.isAdult && aniListStore.allowAdultContent))
      .map((item) => {
        const outputFormat = item.startDate.day
          ? this.$t('system.dates.full') as string
          : item.startDate.month
            ? this.$t('system.dates.monthAndYear') as string
            : item.startDate.year
              ? this.$t('system.dates.yearOnly') as string
              : undefined;
        const usersListStatus = !!aniListStore.aniListData.lists.find(list => !!list.entries.find((entry: IAniListEntry) => entry.media.id === item.id));

        let dateFormat = '';
        let itemDate = '';

        if (item.startDate.year) {
          dateFormat = 'YYYY';
          itemDate = `${item.startDate.year}`;
        }

        if (item.startDate.month) {
          dateFormat = 'M-YYYY';
          itemDate = `${item.startDate.month}-${item.startDate.year}`;
        }

        if (item.startDate.day) {
          dateFormat = `D-${dateFormat}`;
          itemDate = `${item.startDate.day}-${itemDate}`;
        }
        const startDateTimestamp = moment(itemDate, dateFormat).format('X');
        const startDate = moment(itemDate, dateFormat).format(outputFormat)
          || this.$t('system.dates.dateUnknown');
        const coverImage = item.coverImage.extraLarge;

        return {
          id: item.id,
          inList: usersListStatus,
          isAdult: item.isAdult,
          isLocked: item.isLocked,
          name: item.title.userPreferred,
          coverImage,
          episodes: item.episodes || 0,
          startDateTimestamp,
          startDate,
        };
      })
      .orderBy(['startDateTimestamp'], ['asc'])
      .value();
  }

  private async created() {
    // Listen to event
    eventBus.$on('updateSeason', async (season: UpdateSeasonProperties) => {
      await appStore.setLoadingState(true);
      try {
        const preview = await API.getSeasonPreview(season.year, season.season);
        if (!preview) {
          this.media = [];
        } else {
          this.media = preview.media;
        }
      } catch (error) {
        this.media = [];
      }
      await appStore.setLoadingState(false);
    });

    try {
      const preview = await API.getSeasonPreview(this.seasonYear, this.season);
      if (!preview) {
        this.media = [];
      } else {
        this.media = preview.media;
      }
    } catch (error) {
      this.media = [];
    }
  }

  private async addMediaToPlanList(item: any): Promise<void> {
    await appStore.setLoadingState(true);

    try {
      const response = await API.addEntry(item.id, AniListListStatus.PLANNING);

      if (response) {
        // eslint-disable-next-line no-param-reassign
        item.inList = true;

        // We don't want to reload everytime a media is added to planned list
        // so we just set the refresh timer to half a minute, which is enough time
        // to think about adding another anime to the planned list which then resets the timer again
        const tempRefreshRate = aniListStore.refreshRate;
        await aniListStore.setRefreshRate(0.5);
        await aniListStore.restartRefreshTimer();
        await aniListStore.setRefreshRate(tempRefreshRate);
      }
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['SeasonPreview', 'addMediaToPlanList'], error);
    }

    await appStore.setLoadingState(false);
  }

  private getCurrentSeason(): AniListSeason {
    const currentMonth = new Date().getUTCMonth();

    // Spring months
    return currentMonth >= 2 && currentMonth <= 4
      ? AniListSeason.SPRING
      // Summer months
      : currentMonth >= 5 && currentMonth <= 7
        ? AniListSeason.SUMMER
        // Fall months
        : currentMonth >= 8 && currentMonth <= 10
          ? AniListSeason.FALL
          : AniListSeason.WINTER;
  }
}
</script>
