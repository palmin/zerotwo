<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs3>
            <v-container fluid>
              <v-layout row wrap>
                <v-flex xs12>
                  <h3 class="headline">Filters</h3>
                </v-flex>
                <v-flex xs12>
                  <v-select v-model="adultContentValue" :items="adultContent" label="Adult content" hint="Keep clear to search for both adult content and non-adult content." persistent-hint clearable></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-select label="In List" v-model="listValues" :items="listStatus" hint="Keep clear to also search for media that is not yet in your list" clearable persistent-hint multiple chips small-chips></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-combobox v-model="genreValues" :items="genres" clearable :search-input.sync="genreSearch" hide-selected hint="Max. 3" label="Genres" multiple persistent-hint small-chips>
                    <template v-slot:no-data>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            No genre matching "<strong>{{ genreSearch }}</strong>". Press <kbd>enter</kbd> to create it.
                          </v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-combobox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>

          <v-flex xs9>
            <v-container fluid fill-height grid-list-md>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-text-field v-model="searchInput" @keyup.enter="search" label="Search Query" prepend-icon="mdi-magnify"></v-text-field>
                </v-flex>

                <v-flex xs12 class="mb-2" v-for="result in searchResults" :key="result.id">
                  <v-layout d-flex row>
                    <v-flex xs2>
                      <v-img :src="result.coverImage.extraLarge"></v-img>
                    </v-flex>
                    <v-flex xs10>
                      <v-layout row wrap>
                        <v-flex xs10>
                          <h3 class="title">{{ result.title.romaji }}</h3>
                          <h3 class="subheading">{{ result.title.native }}</h3>
                        </v-flex>
                        <v-flex xs2>
                          <h3 v-if="!result.mediaListEntry">{{ result.episodes }} episodes</h3>
                          <h3 v-else>{{ result.mediaListEntry.progress }} / {{ result.episodes || '?' }}</h3>

                          <div>
                            <template v-if="result.mediaListEntry">
                              <v-icon color="green">mdi-account</v-icon> {{ result.mediaListEntry.score }}
                            </template>
                            <v-icon color="yellow lighten-1">mdi-account-group</v-icon> {{ result.averageScore || 'n.a.' }}
                          </div>
                        </v-flex>

                        <!-- <v-flex xs2 offset-xs10 align-center="">
                          <template v-if="result.mediaListEntry">
                            <v-icon color="green">mdi-account</v-icon> {{ result.mediaListEntry.score }}
                          </template>

                          <v-icon small color="yellow lighten-1">mdi-star</v-icon>

                          <v-icon>mdi-account-group</v-icon> {{ result.averageScore }}
                        </v-flex> -->

                        <!-- <v-flex xs10>
                          <h3>{{ result.title.native }}</h3>
                        </v-flex>

                        <v-flex xs12>
                          <h3>{{ result.title.english }}</h3>
                        </v-flex> -->
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import API from '@/modules/AniList/API';
import { AniListListStatus, IAniListSearchResult } from '@/modules/AniList/types';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
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
      this.searchResults = await API.searchAnime(this.searchInput, filters) || [];
    } catch (error) {
      this.$notify({
        type: 'error',
        title: 'ERROR',
        text: error,
      });
    }
  }

  @Watch('genreValues')
  private onGenreValuesChange(value: string[]) {
    if (value.length > 3) {
      this.$nextTick(() => this.genreValues.pop());
    }
  }
}
</script>
