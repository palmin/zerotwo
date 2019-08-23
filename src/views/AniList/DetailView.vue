<template>
  <v-content>
    <v-layout wrap>
      <v-flex xs12>
        <Loading v-if="!item" />
        <BannerImage v-if="item && item.bannerImage" :item="item" />
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-md>
      <v-layout wrap fill-height>
        <template v-if="item">
          <v-layout wrap>
            <v-flex xs3>
              <CoverImage :cover-image="item.coverImage" />
            </v-flex>

            <v-flex xs9>
              <v-layout wrap>
                <v-flex xs6>
                  <MediaDetails :item="item" />
                </v-flex>

                <v-flex xs6>
                  <UserListSettings :item="item" @updated="updateItem" />
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <StreamingService :item="item" />
            </v-flex>

            <v-flex xs12>
              <Description :item="item" />
            </v-flex>
          </v-layout>
        </template>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import BannerImage from '@/components/AniList/DetailElements/BannerImage.vue';
import CoverImage from '@/components/AniList/DetailElements/CoverImage.vue';
import Description from '@/components/AniList/DetailElements/Description.vue';
import Loading from '@/components/AniList/DetailElements/Loading.vue';
import MediaDetails from '@/components/AniList/DetailElements/MediaDetails.vue';
import StreamingService from '@/components/AniList/DetailElements/StreamingService.vue';
import UserListSettings from '@/components/AniList/DetailElements/UserListSettings.vue';
import API from '@/modules/AniList/API';
import { IAniListEntry, IAniListMedia } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';

@Component({
  components: {
    BannerImage,
    CoverImage,
    Description,
    Loading,
    MediaDetails,
    StreamingService,
    UserListSettings,
  },
})
export default class DetailView extends Vue {
  private entry: IAniListEntry | null = null;

  private async created() {
    await appStore.setLoadingState(true);
    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      await this.loadListEntry(aniListId);

      if (!this.entry) {
        return;
      }

      await aniListStore.setCurrentMediaTitle(this.entry.media.title.userPreferred);
    } catch (error) {
      await appStore.setLoadingState(false);
      this.$router.back();

      return;
    }

    await appStore.setLoadingState(false);
  }

  private async updateItem(): Promise<void> {
    await appStore.setLoadingState(true);

    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      await this.loadListEntry(aniListId);

      if (!this.entry) {
        return;
      }

      await aniListStore.setCurrentMediaTitle(this.entry.media.title.userPreferred);
    } catch (error) {
      await appStore.setLoadingState(false);
      this.$router.back();

      return;
    }

    await appStore.setLoadingState(false);
  }

  private async loadListEntry(aniListId: number): Promise<void> {
    this.entry = await API.getListEntryByMediaId(aniListId);

    // Media does not exist
    if (!this.entry) {
      throw new Error('Media does not exist!');
    }
  }

  private get item() {
    if (!this.entry || !this.entry.media) {
      return null;
    }

    const { media } = this.entry;
    const startDate = this.getReadableDate(media.startDate);
    const endDate = this.getReadableDate(media.endDate);
    const startDateBeforeNow: boolean = this.isDateBeforeNow(media.startDate);
    const endDateBeforeNow: boolean = this.isDateBeforeNow(media.endDate);
    const airingTime = this.getAiringDate(startDate, endDate, media, startDateBeforeNow, endDateBeforeNow);

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
      mediaId: media.id,
      nativeTitle: media.title.native,
      nextAiringEpisode: media.nextAiringEpisode,
      score: media.averageScore || '-',
      streamingEpisodes: media.streamingEpisodes,
      synonyms,
      title: media.title.romaji,
      userPreferredTitle: media.title.userPreferred,
      type: media.type,
    };
  }

  private isDateBeforeNow({ day, month, year }: { day: number | null, month: number | null, year: number | null }): boolean {
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

  private getAiringDate(startDate: string | null, endDate: string | null, media: IAniListMedia, startDateBeforeNow: boolean, endDateBeforeNow: boolean): string {
    let airingTime = '';

    if (startDate && endDate) {
      if (startDateBeforeNow) {
        if (startDate === endDate) {
          airingTime = this.$t('detailView.airesOn', [startDate]) as string;
        } else {
          airingTime = this.$t('detailView.airesFromTo', [startDate, endDate]) as string;
        }
      } else if (!startDateBeforeNow && endDateBeforeNow) {
        airingTime = this.$t('detailView.airesFromTo', [startDate, endDate]) as string;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (startDate === endDate) {
          airingTime = this.$t('detailView.airedOn', [startDate]) as string;
        } else {
          airingTime = this.$t('detailView.airedOnTo', [startDate, endDate]) as string;
        }
      }
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

    return airingTime;
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
