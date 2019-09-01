<template>
  <v-menu
    v-model="sortMenu"
    :close-on-content-click="false"
    offset-y
  >
    <template v-slot:activator="{ on: sortWindow }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn
            v-if="isSortingPage"
            text
            icon
            v-on="{ ...toolTip, ...sortWindow }"
          >
            <v-icon>mdi-sort</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.sort') }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>{{ $t('actions.sort') }}</v-card-title>
      <v-container fluid grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm7>
            <v-select
              v-model="sortItem"
              :items="sortingItems"
              :label="$t('components.sorting.sortingLabel')"
              @change="changeSorting"
            />
          </v-flex>
          <v-flex xs12 sm5>
            <v-radio-group v-model="direction" column @change="changeDirection">
              <v-radio :label="$t('components.sorting.directions.ascending')" value="asc" />
              <v-radio :label="$t('components.sorting.directions.descending')" value="desc" />
            </v-radio-group>
          </v-flex>
        </v-layout>
      </v-container>

      <v-divider class="ma-4" />

      <v-container fluid grid-list-md>
        <v-layout>
          <v-flex xs12>
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
              dense
              @change="changeGenres"
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

      <v-card-actions>
        <v-btn text block @click="resetFilters">
          <v-icon left>
            mdi-restore
          </v-icon>
          {{ $t('actions.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import EventBus from '@/eventBus';

interface SelectItem {
  text: string;
  value: string;
}

@Component
export default class Sort extends Vue {
  private genres = [
    'Action',
    'Mystery',
  ];

  private genreValues = [];

  private genreSearch = null;

  private sortMenu: boolean = false;

  private direction: string = 'asc';

  private sortItem: string = 'title';

  private created() {
    EventBus.$on('resetAllSorts', () => {
      this.resetFilters(false);
    });
  }

  private get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  private get sortingItems(): SelectItem[] {
    const items: SelectItem[] = [];

    switch (this.$route.name) {
      case 'Watching':
      case 'Repeating':
      case 'Completed':
      case 'Dropped':
      case 'Planning':
      case 'Paused':
        items.push({
          text: this.$t('components.sorting.title') as string,
          value: 'title',
        }, {
          text: this.$t('components.sorting.score') as string,
          value: 'score',
        }, {
          text: this.$t('components.sorting.progress') as string,
          value: 'progressPercentage',
        }, {
          text: this.$t('components.sorting.startingDate') as string,
          value: 'startDate',
        }, {
          text: this.$t('components.sorting.episodeAmount') as string,
          value: 'episodeAmount',
        });
        break;
      case 'SeasonPreview':
        items.push({
          text: this.$t('components.sorting.title') as string,
          value: 'title',
        }, {
          text: this.$t('components.sorting.startingDate') as string,
          value: 'startDateTimestamp',
        }, {
          text: this.$t('components.sorting.episodeAmount') as string,
          value: 'episodes',
        });
        break;
      default:
        break;
    }

    return items;
  }

  private changeSorting(value: any) {
    EventBus.$emit('changeSorting', {
      sortBy: value,
      direction: this.direction,
    });
  }

  private changeDirection(value: string) {
    if (!this.sortItem) {
      this.sortItem = this.sortingItems[0].value;
    }

    EventBus.$emit('changeSorting', {
      sortBy: this.sortItem,
      direction: value,
    });
  }

  private changeGenres(values: string[]) {
    EventBus.$emit('changeFiltering', {
      genres: values,
    });
  }

  private resetFilters(emitEvents: boolean = true): void {
    this.genreValues = [];
    this.sortItem = 'title';
    this.direction = 'asc';

    if (emitEvents) {
      this.changeGenres(this.genreValues);
      this.changeSorting(this.sortItem);
      // Direction is automatically send with sorting
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
