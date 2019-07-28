<template>
  <v-content>
    <v-layout
      row
      wrap
    >
      <template v-if="!item">
        <v-flex xs12>
          <v-layout
            fill-height
            align-center
            justify-center
            ma-0
          >
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            />
          </v-layout>
        </v-flex>
      </template>
      <template v-if="item">
        <v-flex
          v-if="item.bannerImage"
          xs12
        >
          <v-img
            :src="item.bannerImage"
            height="250px"
            position="50% 35%"
          >
            <template v-slot:placeholder>
              <v-layout
                fill-height
                align-center
                justify-center
                ma-0
              >
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                />
              </v-layout>
            </template>
          </v-img>
        </v-flex>
      </template>
    </v-layout>
    <v-container
      fluid
      grid-list-md
    >
      <v-layout
        row
        wrap
        fill-height
      >
        <template v-if="item">
          <v-layout
            row
            wrap
          >
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
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      />
                    </v-layout>
                  </template>
                </v-img>
              </v-card>
            </v-flex>

            <v-flex xs9>
              <v-layout
                row
                wrap
              >
                <v-flex xs6>
                  <v-card>
                    <v-list
                      dense
                      two-line
                    >
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

                      <v-list-item
                        v-if="item.isAdult"
                        color="red"
                      >
                        <v-list-item-content>
                          <v-list-item-title>{{ $t('detailView.adult') }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
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
                        <v-flex>
                          <v-select
                            v-model="item.listEntry.status"
                            dense
                            full-width
                            :items="listStatusses"
                            :label="$t('detailView.ownStatus')"
                            :rules="[rules.required]"
                          />
                        </v-flex>

                        <v-flex>
                          <v-text-field
                            v-model="item.listEntry.progress"
                            outlined
                            :mask="getMask(item.episodes)"
                            :suffix="`/ ${item.episodes}`"
                            full-width
                            :label="$t('detailView.ownProgress')"
                            :rules="[rules.required]"
                          />
                        </v-flex>

                        <v-flex>
                          <v-text-field
                            v-if="scoreSystem === POINT_100"
                            v-model="item.listEntry.score"
                            suffix="/ 100"
                            full-width
                            :label="$t('detailView.ownScore')"
                            :rules="[rules.required]"
                          />

                          <div
                            v-if="scoreSystem !== POINT_100"
                            class="text-center ma-auto"
                          >
                            <div class="body-1 text-xs-left pl-1">
                              {{ $t('detailView.ownScore') }} ({{ item.listEntry.score }})
                            </div>
                            <v-rating
                              v-if="scoreSystem === POINT_10_DECIMAL"
                              v-model="item.listEntry.score"
                              length="10"
                              hover
                              half-increments
                            />

                            <v-rating
                              v-if="scoreSystem === POINT_10"
                              v-model="item.listEntry.score"
                              length="10"
                              hover
                              dense
                            />

                            <v-rating
                              v-if="scoreSystem === POINT_5"
                              v-model="item.listEntry.score"
                              length="5"
                              hover
                              dense
                            />

                            <v-rating
                              v-if="scoreSystem === POINT_3"
                              v-model="item.listEntry.score"
                              length="3"
                              hover
                              dense
                            />
                          </div>
                        </v-flex>

                        <v-flex>
                          <v-layout>
                            <v-flex>
                              <v-btn
                                text
                                block
                                color="success"
                                @click="saveChanges"
                              >
                                <v-icon left>
                                  mdi-content-save
                                </v-icon>
                                {{ $t('system.actions.save') }}
                              </v-btn>
                            </v-flex>
                            <v-flex>
                              <v-btn
                                text
                                block
                                color="error"
                              >
                                <v-icon left>
                                  mdi-delete
                                </v-icon>
                                {{ $t('system.actions.remove') }}
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-card-actions>

                    <v-card-actions v-else>
                      <v-btn
                        text
                        color="success"
                        block
                      >
                        <v-icon left>
                          mdi-library-plus
                        </v-icon>
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
                <v-card-text>
                  {{ item.description }}
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex xs4>
              <v-card>
                <v-list>
                  <v-list-group v-model="streamingEpisodesExpanded">
                    <template v-slot:activator>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>{{ $t('detailView.streamingSubheader') }}</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>

                    <v-list-item
                      v-for="episode in item.streamingEpisodes"
                      :key="episode.url"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ episode.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ episode.site }}</v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-icon
                          color="yellow"
                          @click="openInBrowser(episode.url)"
                        >
                          mdi-open-in-new
                        </v-icon>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-group>

                  <v-list-item v-if="item.nextAiringEpisode && item.nextAiringEpisode.episode">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.nextAiringEpisode.episode }}</v-list-item-title>
                      <v-list-item-subtitle>{{ getReadableDateByTimestamp(item.nextAiringEpisode.airingAt) || $t('system.alerts.noInformation') }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon
                        color="yellow"
                        @click="openInBrowser(episode.url)"
                      >
                        mdi-open-in-new
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>
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
import { shell } from 'electron';
import { chain, isNumber } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { aniListStore, appStore } from '@/store';
import {
  AniListListStatus, AniListScoreFormat, IAniListEntry, IAniListMedia,
} from '@/modules/AniList/types';
import API from '@/modules/AniList/API';

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
    text: this.$root.$t('listStatusses.watching'),
    value: AniListListStatus.CURRENT,
  }, {
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
  }];

  private readonly rules = {
    required: (value: any) => !!value || this.$root.$t('system.rules.required'),
  };

  private get item() {
    if (!this.entry || !this.entry.media) {
      return null;
    }
    const { media } = this.entry;
    const startDate = this.getReadableDate(media.startDate);
    const endDate = this.getReadableDate(media.endDate);
    const startDateBeforeNow: boolean = this.isStartDateBeforeNow(media.startDate);

    let airingTime = '';
    if (startDate && endDate) {
      airingTime = this.$t('detailView.airedOn', [startDate, endDate]) as string;
    } else if (startDate && !endDate) {
      if (startDateBeforeNow) {
        if (media.startDate.day) {
          airingTime = this.$t('detailView.airingStartsOnDay', [startDate]) as string;
        } else if (media.startDate.month) {
          airingTime = this.$t('detailView.airingStartsInMonthYear', [startDate]) as string;
        } else {
          airingTime = this.$t('detailView.airingStartsInYear', [startDate]) as string;
        }
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
      entryId: this.entry.id,
      episodes: media.episodes || this.$t('system.alerts.unknown'),
      genres,
      listEntry,
      nativeTitle: media.title.native,
      nextAiringEpisode: media.nextAiringEpisode,
      score: media.averageScore || '-',
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

    const { scoreFormat } = aniListStore.session.user.mediaListOptions;

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
    }
    return '#'.repeat(input);
  }

  // tslint:disable-next-line max-line-length
  private isStartDateBeforeNow({ day, month, year }: { day: number | null, month: number | null, year: number | null }): boolean {
    const now = moment();

    if (!year && !month && !day) {
      return false;
    } if (year && !month && !day) {
      return now.isBefore(moment(year, 'YYYY'));
    } if (year && month && !day) {
      return now.isBefore(moment(`${month}-${year}`, 'M-YYYY'));
    } if (year && month && day) {
      return now.isBefore(moment(`${day}-${month}-${year}`, 'D-M-YYYY'));
    }
    return false;
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

  private async saveChanges(): Promise<void> {
    await appStore.setLoadingState(true);
    if (this.item && this.item.listEntry) {
      const { status } = this.item.listEntry;
      const { progress } = this.item.listEntry;
      const { score } = this.item.listEntry;
      const { entryId } = this.item;

      try {
        await API.updateEntry(entryId, progress, score, status);
      } catch (error) {
        this.$notify({
          title: this.$t('system.errors.updateFailed.title') as string,
          text: this.$t('system.errors.updateFailed.text') as string,
          type: 'error',
        });
      }
    }
    await appStore.setLoadingState(false);
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
