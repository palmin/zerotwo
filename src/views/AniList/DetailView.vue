<template>
  <v-content>
    <v-layout row wrap>
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
      </template>
    </v-layout>
    <v-container fluid grid-list-md>
      <v-layout row wrap fill-height>
        <template v-if="item">
          <v-layout row wrap>
            <v-flex xs3>
              <v-card>
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
              </v-card>
            </v-flex>

            <v-flex xs9>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card>
                    <v-list dense two-line>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.romajiTitle') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.nativeTitle }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.nativeTitle') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.englishTitle }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.englishTitle') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.episodes }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.episodes') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile v-if="item.synonyms">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.synonyms }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.synonyms') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile v-if="item.genres">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.genres }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.genres') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.airingTime }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.airingTime') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ $t('detailView.score', [item.score, 100]) }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ $t('detailView.scoreLabel') }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>

                      <v-list-tile color="red" v-if="item.isAdult">
                        <v-list-tile-content>
                          <v-list-tile-title>{{ $t('detailView.adult') }}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-flex>

                <v-flex xs6>
                  <v-card>
                    <v-card-title primary-title>
                      <div>
                        <h3 class="headline">
                          {{ $t('detailView.ownInformation') }}
                        </h3>
                        <span v-if="!item.listEntry">
                          {{ $t('system.alerts.notYetInList') }}
                        </span>
                      </div>
                    </v-card-title>

                    <v-card-actions v-if="item.listEntry">
                      <v-layout column>
                        <v-flex d-flex>
                          <v-select
                            box
                            dense
                            full-width
                            v-model="item.listEntry.status"
                            :items="listStatusses"
                            :label="$t('detailView.ownStatus')"
                            :rules="[rules.required]"
                          ></v-select>
                        </v-flex>

                        <v-flex d-flex>
                          <v-text-field
                            box
                            :mask="getMask(item.episodes)"
                            :suffix="`/ ${item.episodes}`"
                            full-width
                            v-model="item.listEntry.progress"
                            :label="$t('detailView.ownProgress')"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-flex>

                        <v-flex d-flex>
                          <v-text-field
                            v-if="scoreSystem === POINT_100"
                            suffix="/ 100"
                            box
                            full-width
                            v-model="item.listEntry.score"
                            :label="$t('detailView.ownScore')"
                            :rules="[rules.required]"
                          ></v-text-field>

                          <div class="text-xs-center ma-auto" v-if="scoreSystem !== POINT_100">
                            <div class="body-1 text-xs-left pl-1">
                              {{ $t('detailView.ownScore') }} ({{ item.listEntry.score }})
                            </div>
                            <v-rating
                              v-if="scoreSystem === POINT_10_DECIMAL"
                              length="10"
                              hover
                              half-increments
                              v-model="item.listEntry.score"
                            ></v-rating>

                            <v-rating
                              v-if="scoreSystem === POINT_10"
                              length="10"
                              hover
                              dense
                              v-model="item.listEntry.score"
                            ></v-rating>

                            <v-rating
                              v-if="scoreSystem === POINT_5"
                              length="5"
                              hover
                              dense
                              v-model="item.listEntry.score"
                            ></v-rating>

                            <v-rating
                              v-if="scoreSystem === POINT_3"
                              length="3"
                              hover
                              dense
                              v-model="item.listEntry.score"
                            ></v-rating>
                          </div>
                        </v-flex>

                        <v-flex d-flex>
                          <v-layout row>
                            <v-flex d-flex>
                              <v-btn flat color="success">
                                <v-icon left>mdi-content-save</v-icon>
                                Save
                              </v-btn>
                            </v-flex>
                            <v-flex d-flex>
                              <v-btn flat color="orange">
                                <v-icon left>mdi-restore</v-icon>
                                Reset
                              </v-btn>
                            </v-flex>
                            <v-flex d-flex>
                              <v-btn flat color="error">
                                <v-icon left>mdi-delete</v-icon>
                                Remove
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-card-actions>

                    <v-card-actions v-else>
                      <v-btn flat color="success" block>
                        <v-icon left>mdi-library-plus</v-icon>
                        {{ $t('system.actions.add') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs8>
              <v-card>
                <v-card-title primary-title>
                  <div>
                    <h3 class="headline">
                      {{ $t('detailView.description') }}
                    </h3>
                  </div>
                </v-card-title>
                <v-card-text v-html="item.description">
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs4>
              <v-card>
                <v-list>
                  <v-list-group v-model="streamingEpisodesExpanded">
                    <template v-slot:activator>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ $t('detailView.streamingSubheader') }}</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>

                    <v-list-tile v-for="episode in item.streamingEpisodes" :key="episode.url">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ episode.title }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ episode.site }}</v-list-tile-sub-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-icon @click="openInBrowser(episode.url)" color="yellow">mdi-open-in-new</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list-group>

                  <v-list-tile v-if="item.nextAiringEpisode && item.nextAiringEpisode.episode">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.nextAiringEpisode.episode }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ getReadableDateByTimestamp(item.nextAiringEpisode.airingAt) || $t('system.alerts.noInformation') }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon @click="openInBrowser(episode.url)" color="yellow">mdi-open-in-new</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </template>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import API from '@/modules/AniList/API';
import { AniListListStatus, AniListScoreFormat, IAniListEntry, IAniListMedia } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';
import { shell } from 'electron';
import { chain, isNumber } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DetailView extends Vue {
  private entry: IAniListEntry | null = null;
  private streamingEpisodesExpanded: boolean = false;
  private readonly POINT_100 = AniListScoreFormat.POINT_100;
  private readonly POINT_10_DECIMAL = AniListScoreFormat.POINT_10_DECIMAL;
  private readonly POINT_10 = AniListScoreFormat.POINT_10;
  private readonly POINT_5 = AniListScoreFormat.POINT_5;
  private readonly POINT_3 = AniListScoreFormat.POINT_3;
  private readonly listStatusses = [{
    text: this.$root.$t('listStatusses.completed'),
    value: AniListListStatus.COMPLETED,
  }, {
    text: this.$root.$t('listStatusses.dropped'),
    value: AniListListStatus.DROPPED,
  }, {
    text: this.$root.$t('listStatusses.paused'),
    value: AniListListStatus.PAUSED,
  }, {
    text: this.$root.$t('listStatusses.planning'),
    value: AniListListStatus.PLANNING,
  }, {
    text: this.$root.$t('listStatusses.repeating'),
    value: AniListListStatus.REPEATING,
  }, {
    text: this.$root.$t('listStatusses.watching'),
    value: AniListListStatus.CURRENT,
  }];
  private readonly rules = {
    required: (value: any) => !!value || this.$root.$t('system.rules.required'),
  };

  private get item() {
    if (!this.entry || !this.entry.media) {
      return null;
    }
    const media = this.entry.media;
    const startDate = this.getReadableDate(media.startDate);
    const endDate = this.getReadableDate(media.endDate);
    const startDateBeforeNow: boolean = this.isStartDateBeforeNow(media.startDate);

    let airingTime = '';
    if (startDate && endDate) {
      airingTime = this.$t('detailView.airedOn', [startDate, endDate]) as string;
    } else if (startDate && !endDate) {
      if (startDateBeforeNow) {
        airingTime = this.$t('detailView.airingStarts', [startDate]) as string;
      } else {
        airingTime = this.$t('detailView.airingStartedOn', [startDate]) as string;
      }
    } else if (!startDate && endDate) {
      airingTime = this.$t('detailView.airingWithUnknownStart', [endDate]) as string;
    } else {
      airingTime = this.$t('system.dates.dateUnknown') as string;
    }

    const synonyms = media.synonyms && media.synonyms.length
      ? media.synonyms.join(', ')
      : null;

    const genres = media.genres && media.genres.length
      ? media.genres.join(', ')
      : null;

    const listEntry = this.entry.id
      ? {
        progress: this.entry.progress,
        score: this.entry.score,
        status: this.entry.status,
      }
      : null;

    return {
      airingTime,
      bannerImage: media.bannerImage,
      coverImage: media.coverImage.extraLarge,
      description: media.description || this.$t('system.alerts.noDescription'),
      englishTitle: media.title.english || this.$t('system.alerts.noEnglishTitle'),
      episodes: media.episodes || this.$t('system.alerts.unknown'),
      genres,
      listEntry,
      nativeTitle: media.title.native,
      nextAiringEpisode: media.nextAiringEpisode,
      score: media.averageScore,
      streamingEpisodes: media.streamingEpisodes,
      synonyms,
      title: media.title.romaji,
      type: media.type,
    };
  }

  private get scoreSystem(): AniListScoreFormat | null {
    if (!this.item) {
      return null;
    }

    const scoreFormat = aniListStore.session.user.mediaListOptions.scoreFormat;

    return scoreFormat === AniListScoreFormat.POINT_3
      ? AniListScoreFormat.POINT_3
      : scoreFormat === AniListScoreFormat.POINT_5
        ? AniListScoreFormat.POINT_5
        : scoreFormat === AniListScoreFormat.POINT_10
          ? AniListScoreFormat.POINT_10
          : scoreFormat === AniListScoreFormat.POINT_10_DECIMAL
            ? AniListScoreFormat.POINT_10_DECIMAL
            : AniListScoreFormat.POINT_100;
  }

  private getMask(input: number | string): string | undefined {
    if (!isNumber(input)) {
      return '#####';
    } else {
      return '#'.repeat(input);
    }
  }

  // tslint:disable-next-line max-line-length
  private isStartDateBeforeNow({ day, month, year }: { day: number | null, month: number | null, year: number | null }): boolean {
    const now = moment();

    if (!year && !month && !day) {
      return false;
    } else if (year && !month && !day) {
      return now.isBefore(moment(year, 'YYYY'));
    } else if (year && month && !day) {
      return now.isBefore(moment(`${month}-${year}`, 'M-YYYY'));
    } else if (year && month && day) {
      return now.isBefore(moment(`${day}-${month}-${year}`, 'D-M-YYYY'));
    } else {
      return false;
    }
  }

  // tslint:disable-next-line max-line-length
  private getReadableDate({ day, month, year }: { day: number | null, month: number | null, year: number | null }): string | null {
    let format: string = '';

    if (!year && !month && !day) {
      return null;
    }

    if (year && !month && !day) {
      format = this.$t('system.dates.yearOnly') as string;

      return moment(year, 'YYYY').format(format);
    }

    if (year && month && !day) {
      format = this.$t('system.dates.monthAndYear') as string;

      return moment(`${month}-${year}`, 'M-YYYY').format(format);
    }

    format = this.$t('system.dates.full') as string;

    return moment(`${day}-${month}-${year}`, 'D-M-YYYY').format(format);
  }

  private getReadableDateByTimestamp(timestamp?: number): string | null {
    if (!timestamp) {
      return null;
    }

    const format = this.$t('system.dates.full') as string;

    const formattedMoment = moment(timestamp, 'X');
    if (!formattedMoment.isValid()) {
      return null;
    }

    return formattedMoment.format(format);
  }

  private openInBrowser(link: string) {
    shell.openExternal(link);
  }

  private async created() {
    await appStore.setLoadingState(true);
    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      this.entry = await API.getListEntryByMediaId(aniListId);

      // Media does not exist
      if (!this.entry) {
        throw new Error('Media does not exist!');
      }

      await aniListStore.setCurrentMediaTitle(this.entry.media.title.userPreferred);
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
.v-list,
.v-image,
.v-card {
  border-radius: 5px;
}

</style>
