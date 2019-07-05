<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-container fluid fill-height grid-list-md>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-text-field v-model="searchInput" @keyup.enter="search" label="Search Query" prepend-icon="mdi-magnify"></v-text-field>
                </v-flex>

                <v-flex xs2>
                  <v-select v-model="adultContentValue" :items="adultContent" label="Adult content" hint="Keep clear to search for both adult content and non-adult content." persistent-hint clearable></v-select>
                </v-flex>

                <v-flex xs2>
                  <v-select label="In List" v-model="listValues" :items="listStatus" hint="Keep clear to also search for media that is not yet in your list" clearable persistent-hint multiple chips small-chips></v-select>
                </v-flex>

                <v-flex xs2>
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

          <v-flex d-flex xs3 lg3 xl2 v-for="result in searchResults" :key="result.id">
            <v-card class="ma-1">
              <v-layout row wrap>
                <v-flex xs12>
                  <ListImage :imageLink="result.coverImage.extraLarge" :aniListId="result.id" :name="result.title.romaji" />
                </v-flex>
                <v-flex xs12>
                  <v-container fluid class="pa-3">
                    <v-layout row wrap>
                      <v-flex xs12>
                        <template v-if="result.mediaListEntry">
                          <ProgressCircle
                            :entryId="result.mediaListEntry.id"
                            :status="result.mediaListEntry.status"
                            :progressPercentage="0"
                            :currentProgress="result.mediaListEntry.progress"
                            :episodeAmount="result.episodes || '?'"
                            @increase="() => {}" />
                        </template>
                        <template v-else>
                          <ProgressCircle
                            :entryId="0"
                            :status="null"
                            :progressPercentage="0"
                            :currentProgress="0"
                            :episodeAmount="result.episodes || '?'"
                            @increase="() => {}" />
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
                <v-layout align-center justify-end>
                  <template v-if="result.mediaListEntry">
                    <v-icon color="green" class="pr-1">mdi-account</v-icon>{{ result.mediaListEntry.score }}
                    <v-divider vertical class="mx-2"></v-divider>
                  </template>
                  <v-icon color="yellow lighten-1" class="pr-1">mdi-account-group</v-icon>{{ result.averageScore || 'n.a.' }}
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
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import ProgressCircle from '@/components/AniList/ListElements/ProgressCircle.vue';
import API from '@/modules/AniList/API';
import { AniListListStatus, IAniListSearchResult } from '@/modules/AniList/types';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: { ListImage, ProgressCircle },
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
