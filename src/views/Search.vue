<template>
  <v-content>
    <v-layout fill-height fluid>
      <v-flex xs12 fill-height>
        <v-container fluid fill-height class="px-0 py-0">
          <v-layout wrap>
            <v-flex xs12>
              <v-card class="no-border-radius">
                <v-card-text>
                  <v-container fluid grid-list-md>
                    <v-layout>
                      <v-flex xs6>
                        <v-text-field
                          v-model="searchInput"
                          :label="$t('pages.search.searchQuery')"
                          prepend-icon="mdi-magnify"
                          @keyup.enter="search"
                        />
                      </v-flex>

                      <v-flex xs2>
                        <v-select
                          v-model="adultContentValue"
                          :items="adultContent"
                          :label="$t('pages.search.adultContent.label')"
                          :hint="$t('pages.search.adultContent.hint')"
                          persistent-hint
                          clearable
                        />
                      </v-flex>

                      <v-flex xs2>
                        <v-select
                          v-model="listValues"
                          :label="$t('pages.search.inList.label')"
                          :items="listStatus"
                          :hint="$t('pages.search.inList.hint')"
                          clearable
                          persistent-hint
                          multiple
                          chips
                          small-chips
                        />
                      </v-flex>

                      <v-flex xs2>
                        <v-combobox
                          v-model="genreValues"
                          :items="genres"
                          clearable
                          :search-input.sync="genreSearch"
                          hide-selected
                          :label="$t('pages.search.genres.label')"
                          :hint="$t('pages.search.genres.hint')"
                          multiple
                          persistent-hint
                          small-chips
                        >
                          <template v-slot:no-data>
                            <v-list-item>
                              <v-list-item-content>
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <v-list-item-title v-html="$t('pages.search.genres.noMatch', [genreSearch])" />
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-combobox>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-flex>

            <v-flex
              v-for="result in searchResults"
              :key="result.id"
              xs3
              lg3
              xl2
            >
              <v-card class="ma-1">
                <ListImage
                  :image-link="result.coverImage.extraLarge"
                  :ani-list-id="result.id"
                  :name="result.title.romaji"
                />

                <v-card-text>
                  <v-layout wrap>
                    <v-flex xs4>
                      <template v-if="result.mediaListEntry">
                        <ProgressCircle
                          :entry-id="result.mediaListEntry.id"
                          :status="result.mediaListEntry.status"
                          :progress-percentage="result.progressPercentage"
                          :current-progress="result.mediaListEntry.progress"
                          :episode-amount="result.episodes || '?'"
                          @increase="() => {}"
                        />
                      </template>
                      <template v-else>
                        <ProgressCircle
                          :entry-id="0"
                          :status="null"
                          :progress-percentage="0"
                          :current-progress="0"
                          :episode-amount="result.episodes || '?'"
                          @increase="() => {}"
                        />
                      </template>
                    </v-flex>
                    <v-flex xs8>
                      <v-layout>
                        <v-flex v-if="result.isAdult">
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                large
                                color="error"
                                v-on="on"
                              >
                                mdi-alert
                              </v-icon>
                            </template>
                            <span>{{ $t('alerts.adultContent') }}</span>
                          </v-tooltip>
                        </v-flex>
                        <v-flex grow>
                          <v-layout align-center justify-end>
                            <template v-if="result.mediaListEntry">
                              <v-icon color="green" class="pr-1">
                                mdi-account
                              </v-icon>{{ result.mediaListEntry.score }}
                              <v-divider vertical class="mx-2" />
                            </template>
                            <v-icon color="yellow lighten-1" class="pr-1">
                              mdi-account-group
                            </v-icon>{{ result.averageScore || 'n.a.' }}
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>

                <v-card-actions class="icon-actionize">
                  <v-layout pa-1>
                    <v-flex text-center>
                      <v-icon :color="result.isWatching ? 'green' : 'grey darken-2'">
                        mdi-play
                      </v-icon>
                    </v-flex>

                    <v-flex text-center>
                      <v-icon :color="result.isRepeating ? 'green darken-3' : 'grey darken-2'">
                        mdi-repeat
                      </v-icon>
                    </v-flex>

                    <v-flex text-center>
                      <v-icon :color="result.isCompleted ? 'blue' : 'grey darken-2'">
                        mdi-check
                      </v-icon>
                    </v-flex>

                    <v-flex text-center>
                      <v-icon :color="result.isPaused ? 'yellow darken-2' : 'grey darken-2'">
                        mdi-pause
                      </v-icon>
                    </v-flex>

                    <v-flex text-center>
                      <v-icon :color="result.isDropped ? 'red darken-1' : 'grey darken-2'">
                        mdi-stop
                      </v-icon>
                    </v-flex>

                    <v-flex text-center>
                      <v-icon :color="result.isPlanning ? '' : 'grey darken-2'">
                        mdi-playlist-plus
                      </v-icon>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AdultToolTip from '@/components/AniList/ListElements/AdultToolTip.vue';
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import ProgressCircle from '@/components/AniList/ListElements/ProgressCircle.vue';
import API from '@/modules/AniList/API';
import { AniListListStatus, IAniListSearchResult } from '@/modules/AniList/types';

@Component({
  components: { AdultToolTip, ListImage, ProgressCircle },
})
export default class Search extends Vue {
  private searchInput: string = '';

  private searchResults: IAniListSearchResult[] = [];

  private listStatus = [{
    text: this.$root.$t('misc.aniList.listStatusses.watching'),
    value: AniListListStatus.CURRENT,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.completed'),
    value: AniListListStatus.COMPLETED,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.dropped'),
    value: AniListListStatus.DROPPED,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.paused'),
    value: AniListListStatus.PAUSED,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.planning'),
    value: AniListListStatus.PLANNING,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.repeating'),
    value: AniListListStatus.REPEATING,
  }];

  private genres = [
    'Action',
    'Mystery',
  ];

  private adultContent = [{
    text: this.$root.$t('pages.search.adultContent.onlyNonAdult'),
    value: false,
  }, {
    text: this.$root.$t('pages.search.adultContent.onlyAdult'),
    value: true,
  }];

  private listValues: AniListListStatus[] = [];

  private genreValues = [];

  private adultContentValue = null;

  private genreSearch = null;

  private created() {
    if (this.$route.params && this.$route.params.query) {
      this.searchInput = this.$route.params.query;

      this.search();
    }
  }

  private async search() {
    if (!this.searchInput.length) {
      return;
    }

    const filters = {
      listStatus: this.listValues,
      isAdult: this.adultContentValue,
      genres: this.genreValues,
    };

    try {
      const results = await API.searchAnime(this.searchInput, filters) || [];

      this.searchResults = results.map((result) => {
        const object = Object.assign({}, {
          isWatching: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.CURRENT,
          isRepeating: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.REPEATING,
          isCompleted: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.COMPLETED,
          isDropped: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.DROPPED,
          isPaused: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.PAUSED,
          isPlanning: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.PLANNING,
        }, result);

        if (result.mediaListEntry) {
          return Object.assign({}, {
            progressPercentage: this.calculateProgressPercentage(result),
          }, object);
        }

        return object;
      });
    } catch (error) {
      this.$notify({
        type: 'error',
        title: 'ERROR',
        text: error,
      });
    }
  }

  private calculateProgressPercentage(entry: IAniListSearchResult): number {
    if (!entry.mediaListEntry) {
      return 0;
    }

    const { episodes, nextAiringEpisode } = entry;
    const currentProgress = entry.mediaListEntry.progress;

    if (!currentProgress) {
      return 0;
    }

    // Check if max episode amount is known
    if (episodes) {
      return currentProgress / episodes * 100;
    }

    // We don't know the exact amount of episodes
    // But we might know how many episodes have been aired so far
    // so we can calculate the percentage of the currently available episodes
    // and then add some buffer
    if (nextAiringEpisode && nextAiringEpisode.episode) {
      // We have to substract one here as that episode isn't aired yet
      const episode = nextAiringEpisode.episode - 1 > 0
        ? nextAiringEpisode.episode - 1
        : 1;

      // We choose only 80 percent here, as we are unaware of the episode amount
      return currentProgress / episode * 80;
    }

    // Just return 75% if we have a non-zero progress but
    // neither through the next airing episode nor through the episode amount
    // we can determine our status.
    return 75;
  }

  @Watch('genreValues')
  private onGenreValuesChange(value: string[]) {
    if (value.length > 3) {
      this.$nextTick(() => this.genreValues.pop());
    }
  }
}
</script>

<style lang="scss" scoped>
.no-border-radius {
  border-radius: 0;
}
</style>
