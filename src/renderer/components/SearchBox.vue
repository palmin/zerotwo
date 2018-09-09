<template>
  <v-dialog
    ref="searchDialog"
    v-model="dialog"
    scrollable
    persistent :overlay="false"
    transition="slide-y-reverse-transition"
    origin="bottom center 0"
  >
    <v-btn dark flat icon slot="activator">
      <v-icon>fas fa-search</v-icon>
    </v-btn>
    <v-card dark>
      <v-toolbar color="primary" dark>
        <v-btn icon dark @click.native="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $t('system.menu.search.headline') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex sm12 md12 lg12>
              <v-text-field
                :label="$t('system.menu.search.search')"
                v-model="searchValue"
                @input="searching = true"
                @keyup="searching = false"
              ></v-text-field>
              <v-list two-line>
                <template v-for="result in searchResults">
                  <v-list-tile avatar ripple :key="result.id" @click="openSearchResult(result)">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{ result.title }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title v-if="result.english">
                        {{ result.english }}
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-list-tile-action-text>{{ result.category }}</v-list-tile-action-text>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('aniList', ['aniData']),
    watchingData() {
      const data = _.find(this.aniData.lists, list => list.status === 'CURRENT');
      if (data === undefined) {
        return [];
      }

      return data.entries;
    },
    completedData() {
      const data = _.find(this.aniData.lists, list => list.status === 'COMPLETED');
      if (data === undefined) {
        return [];
      }

      return data.entries;
    },
    pausedData() {
      const data = _.find(this.aniData.lists, list => list.status === 'PAUSED');
      if (data === undefined) {
        return [];
      }

      return data.entries;
    },
    droppedData() {
      const data = _.find(this.aniData.lists, list => list.status === 'DROPPED');
      if (data === undefined) {
        return [];
      }

      return data.entries;
    },
    planningData() {
      const data = _.find(this.aniData.lists, list => list.status === 'PLANNING');
      if (data === undefined) {
        return [];
      }

      return data.entries;
    },
    repeatingData() {
      const data = _.find(this.aniData.lists, list => list.status === 'REPEATING');
      if (data === undefined) {
        return [];
      }

      return data.entries;
    },
  },
  data() {
    return {
      dialog: false,
      searchValue: '',
      searching: false,
      searchTimer: null,
      searchInterval: 500,
      searchResults: [],
      lastSearch: null,
    };
  },
  watch: {
    searching(value) {
      if (!value) {
        this.beginSearching();
        return;
      }

      this.abortSearch();
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.searchResults = [];
      this.searchValue = '';
    },

    openSearchResult(result) {
      this.$emit('openInformation', result);
    },

    triggerSearch() {
      if (this.searchValue.length < 3) {
        this.searchResults = [];
        return;
      }

      this.search();
    },

    beginSearching() {
      if (this.searchValue.length < 3) {
        this.searchResults = [];
        return;
      }

      if (this.searchValue === this.lastSearch) {
        return;
      }

      this.searchTimer = setTimeout(this.search, this.searchInterval);
    },

    abortSearch() {
      clearTimeout(this.searchTimer);
    },

    findInData(title) {
      let needle = null;

      needle = _.find(this.watchingData, haystack => haystack.media.title.userPreferred === title);
      if (needle !== undefined) {
        return needle;
      }

      try {
        needle = _.find(
          this.repeatingData,
          haystack => haystack.media.title.userPreferred === title,
        );
        if (needle !== undefined) {
          return needle;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }

      needle = _.find(this.completedData, haystack => haystack.media.title.userPreferred === title);
      if (needle !== undefined) {
        return needle;
      }

      needle = _.find(this.pausedData, haystack => haystack.media.title.userPreferred === title);
      if (needle !== undefined) {
        return needle;
      }

      needle = _.find(this.droppedData, haystack => haystack.media.title.userPreferred === title);
      if (needle !== undefined) {
        return needle;
      }

      needle = _.find(this.planningData, haystack => haystack.media.title.userPreferred === title);
      if (needle !== undefined) {
        return needle;
      }

      return null;
    },

    search() {
      this.searchTimer = null;
      this.lastSearch = this.searchValue;
      this.$http.searchAnime(this.searchValue)
        .then((results) => {
          if (!results) {
            return [];
          }

          return _.map(results, (result) => {
            const element = this.findInData(result.title.userPreferred);
            result.category = !element ? this.$t('system.menu.search.notInList') : this.getStatus(element.status);

            return {
              id: result.id,
              title: result.title.userPreferred,
              english: result.title.english,
              category: result.category,
            };
          });
        })
        .then((results) => {
          if (_.isEmpty(results)) {
            return;
          }

          this.searchResults = _.chain(results)
            .sortBy(['category', 'title'])
            .value();
        })
        .catch(() => {});
    },

    getStatus(status) {
      let statusText = '';
      switch (status) {
        case 'CURRENT':
          statusText = this.$t('system.listStatus.watching');
          break;
        case 'REPEATING':
          statusText = this.$t('system.listStatus.repeating');
          break;
        case 'COMPLETED':
          statusText = this.$t('system.listStatus.completed');
          break;
        case 'PAUSED':
          statusText = this.$t('system.listStatus.onHold');
          break;
        case 'DROPPED':
          statusText = this.$t('system.listStatus.dropped');
          break;
        case 'PLANNING':
          statusText = this.$t('system.listStatus.planned');
          break;
        default:
          break;
      }

      return statusText;
    },
  },
};
</script>

<style lang="scss" scoped>

#transitionContainer {
  position: absolute;
  top: 100%;
  left: -75%;
  transform-origin: center;
  white-space: normal;
  background: #fff;
  margin-top: .5em;
  width: 40em;
  border-radius: .28571429rem;
  box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
  border: 1px solid #d4d4d5;
  z-index: 998;

  & > :first-child,
  & > :last-child {
    border-radius: .28571429rem .28571429rem 0 0;
  }

  .category {
    display: table-row;
    box-shadow: none;
    background: #f3f4f5;
    transition: background .1s ease,border-color .1s ease;

    &:last-child {
      border-bottom: none;
    }

    .name {
      display: table-cell;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: 0 0;
      font-size: 1em;
      padding: .4em 1em;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.4);
      border-bottom: 1px solid rgba(34,36,38,.1);
    }

    .results {
      display: table-cell;
      background: #fff;
      border-left: 1px solid rgba(34,36,38,.15);
      border-bottom: 1px solid rgba(34,36,38,.1);
      width: 100%;

      .result {
        cursor: pointer;
        display: block;
        overflow: hidden;
        font-size: 1em;
        padding: .85714286em 1.14285714em;
        color: rgba(0,0,0,.87);
        line-height: 1.33;
        border-bottom: 1px solid rgba(34,36,38,.1);
        -webkit-transition: background .1s ease,border-color .1s ease;
        transition: background .1s ease,border-color .1s ease;

        &:hover {
          background: #f9fafb;
        }

        &:last-child {
          border-bottom: none;
        }

        .title {
          margin: -.14285714em 0 0;
          font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
          font-weight: 700;
          font-size: 1em;
          color: rgba(0,0,0,.85);
        }

        .description {
          margin-top: 0;
          font-size: .92857143em;
          color: rgba(0,0,0,.4);
        }
      }
    }
  }
}

</style>
