<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-layout
          row
          wrap
        >
          <v-flex xs12>
            <v-container
              fluid
              fill-height
              grid-list-md
            >
              <v-layout
                row
                wrap
              >
                <v-flex xs6>
                  <v-text-field
                    v-model="searchInput"
                    label="Search Query"
                    prepend-icon="mdi-magnify"
                    @keyup.enter="search"
                  />
                </v-flex>

                <v-flex xs2>
                  <v-select
                    v-model="adultContentValue"
                    :items="adultContent"
                    label="Adult content"
                    hint="Keep clear to search for both adult content and non-adult content."
                    persistent-hint
                    clearable
                  />
                </v-flex>

                <v-flex xs2>
                  <v-select
                    v-model="listValues"
                    label="In List"
                    :items="listStatus"
                    hint="Keep clear to also search for media that is not yet in your list"
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
                    hint="Max. 3"
                    label="Genres"
                    multiple
                    persistent-hint
                    small-chips
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            No genre matching "<strong>{{ genreSearch }}</strong>". Press <kbd>enter</kbd> to create it.
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

          <v-flex
            v-for="result in searchResults"
            :key="result.id"
            d-flex
            xs3
            lg3
            xl2
          >
            <v-card class="ma-1">
              <v-layout
                row
                wrap
              >
                <v-flex xs12>
                  <ListImage
                    :image-link="result.coverImage.extraLarge"
                    :ani-list-id="result.id"
                    :name="result.title.romaji"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-container
                    fluid
                    class="pa-4"
                  >
                    <v-layout
                      row
                      wrap
                    >
                      <v-flex xs12>
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
                      <!--
                      <v-flex xs8>
                        <v-layout align-center justify-end row wrap>
                          <v-flex xs12>
                          </v-flex>
                          <v-flex xs12>
                          </v-flex>
                        </v-layout>
                      </v-flex> -->
                    </v-layout>
                  </v-container>
                </v-flex>
              </v-layout>
              <v-card-actions>
                <AdultToolTip v-if="result.isAdult" />
                <v-layout
                  align-center
                  justify-end
                >
                  <template v-if="result.mediaListEntry">
                    <v-icon
                      color="green"
                      class="pr-1"
                    >
                      mdi-account
                    </v-icon>{{ result.mediaListEntry.score }}
                    <v-divider
                      vertical
                      class="mx-2"
                    />
                  </template>
                  <v-icon
                    color="yellow lighten-1"
                    class="pr-1"
                  >
                    mdi-account-group
                  </v-icon>{{ result.averageScore || 'n.a.' }}
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
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
    text: 'Current',
    value: AniListListStatus.CURRENT,
  }, {
    text: 'Completed',
    value: AniListListStatus.COMPLETED,
  }, {
    text: 'Dropped',
    value: AniListListStatus.DROPPED,
  }, {
    text: 'Paused',
    value: AniListListStatus.PAUSED,
  }, {
    text: 'Rewatching',
    value: AniListListStatus.REPEATING,
  }, {
    text: 'Planning',
    value: AniListListStatus.PLANNING,
  }];

  private genres = [
    'Action',
    'Mystery',
  ];

  private adultContent = [{
    text: 'Only non-adult content',
    value: false,
  }, {
    text: 'Only adult content',
    value: true,
  }];

  private listValues: AniListListStatus[] = [];

  private genreValues = [];

  private adultContentValue = null;

  private genreSearch = null;

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
        if (result.mediaListEntry) {
          return Object.assign({}, {
            progressPercentage: this.calculateProgressPercentage(result),
          }, result);
        }

        return result;
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
