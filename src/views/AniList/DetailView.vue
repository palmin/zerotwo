<template>
  <v-content>
    <v-layout row wrap fill-height>
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
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs3>
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
            </v-flex>

            <v-flex xs9>
              <v-layout row wrap class="pl-3">
                <v-flex xs12>
                  <div class="headline">
                    {{ item.title }}
                  </div>
                </v-flex>

                <v-flex xs6>
                  <v-list dense two-line>
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
                  </v-list>
                </v-flex>

                <v-flex xs6>

                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
              <v-container fluid>
                <div class="headline">
                  {{ $t('detailView.description') }}
                </div>
                <div class="body-2" v-html="item.description"></div>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
import API from '@/modules/AniList/API';
import { IAniListMedia } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';
import { chain } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DetailView extends Vue {
  private media: IAniListMedia | null = null;

  private get item() {
    if (!this.media) {
      return null;
    }

    const startDate = this.getReadableDate(this.media.startDate);
    const endDate = this.getReadableDate(this.media.endDate);

    let airingTime = '';
    if (startDate && endDate) {
      airingTime = this.$t('detailView.airedOn', [startDate, endDate]) as string;
    } else if (startDate && !endDate) {
      airingTime = this.$t('detailView.airingStarts', [startDate]) as string;
    } else if (!startDate && endDate) {
      airingTime = this.$t('detailView.airingWithUnknownStart', [endDate]) as string;
    } else {
      airingTime = this.$t('system.dates.dateUnknown') as string;
    }

    const synonyms = this.media.synonyms && this.media.synonyms.length
      ? this.media.synonyms.join(', ')
      : null;

    const genres = this.media.genres && this.media.genres.length
      ? this.media.genres.join(', ')
      : null;

    return {
      airingTime,
      bannerImage: this.media.bannerImage,
      coverImage: this.media.coverImage.extraLarge,
      description: this.media.description || this.$t('system.alerts.noDescription'),
      englishTitle: this.media.title.english,
      genres,
      nativeTitle: this.media.title.native,
      synonyms,
      title: this.media.title.romaji,
      type: this.media.type,
    };
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

  private async created() {
    await appStore.setLoadingState(true);
    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      this.media = await API.getAnimeInfo(aniListId) as IAniListMedia;
      await aniListStore.setCurrentMediaTitle(this.media.title.userPreferred);
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
.shadowed {
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}

.v-list,
.v-image {
  border-radius: 5px;
}

</style>
