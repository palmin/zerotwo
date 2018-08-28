<template>
  <v-layout child-flex>
    <v-data-table
      dark
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      item-key="id"
      :must-sort="true"
      no-data-text="No data."
      :rows-per-page-items="[pagination.rowsPerPage]"
    >
      <template slot="items" slot-scope="props">
        <td @click="openInformation(props.item.id)">{{ props.item.title }}</td>
        <td class="text-xs-left">
          <!-- <span class="caption">
            {{ props.item.progress }} / {{ props.item.episodes | episode }}
          </span>
          <v-progress-linear color="success" height="1" class="disable-progress-margin"
          :value="props.item.progressInPercent">
          </v-progress-linear> -->

          <span class="caption">
            {{ props.item.progress }} / {{ props.item.episodes | episode }}
          </span>
          <v-progress-linear color="success" height="2" class="disable-progress-margin"
          :value="props.item.progressInPercent">
          </v-progress-linear>
        </td>
        <td class="text-xs-center">{{ props.item.score }}</td>
        <td class="text-xs-center">{{ props.item.season }}</td>
        <td class="text-xs-right">{{ props.item.updated }}</td>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script>
import _ from 'lodash';
import Promise from 'bluebird';
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import InfoBox from '@/components/InformationModal';
import EventBus from '@/plugins/eventBus';

export default {
  props: ['listItems'],

  watch: {
    listItems(list) {
      if (!list || _.isEmpty(list)) {
        return;
      }

      this.finishedHighlight = list.status !== 'COMPLETED';
      this.setReady(true);
    },
  },

  components: { InfoBox },

  computed: {
    ...mapGetters('aniList', ['isAuthenticated']),
    ...mapState('aniList', ['session']),

    headers() {
      return [{
        text: this.$t('system.constants.animeTitle'),
        align: 'left',
        value: 'title',
      }, {
        text: this.$t('system.constants.progress'),
        align: 'center',
        value: 'episode',
      }, {
        text: this.$t('system.constants.score'),
        align: 'center',
        value: 'score',
      }, {
        text: this.$t('system.constants.season'),
        align: 'center',
        value: 'season',
      }, {
        text: this.$t('system.constants.lastUpdated'),
        align: 'center',
        value: 'updated',
        sortable: false,
      }];
    },

    pageText() {
      return `${this.pagination.currentPage}`;
    },
    listEntries() {
      return this.listItems.entries;
    },
    listStatus() {
      return this.listItems.status;
    },
    itemsAvailable() {
      return (this.currentOffset + this.listLimit) < this.listEntries.length;
    },
    items() {
      const items = this.listEntries;

      return _.map(items, item => ({
        id: item.media.id,
        title: item.media.title.userPreferred,
        progress: item.progress,
        episodes: item.media.episodes,
        progressInPercent: item.media.episodes <= 0
          ? 80 : item.progress / item.media.episodes * 100,
        score: item.score,
        season: this.getSeason(item.media.startDate.year, item.media.season),
        updated: this.getTimeByTimestamp(item.updatedAt),
      }));
    },
    list() {
      if (this.currentSort.field === null) {
        return _.slice(this.listEntries, this.currentOffset, (this.currentOffset + this.listLimit));
      }

      const orderedListItems = _.orderBy(this.listEntries, [(item) => {
        if (this.currentSort.field === 'score') {
          // We need to return it as a number
          // because otherwise lodash compares it as a string
          // which would make 10's < 2's
          return Number(item.score);
        }

        if (this.currentSort.field === 'progress') {
          if (+item.progress === 0) {
            // Early return here to prevent the case
            // that if it still has no ending episode amount
            // it returns 4/5 even though no episode has been watched yet.
            // tl;dr: Not yet watched? It's 0% then.
            return 0;
          }
          if (+item.media.episodes <= 0) {
            // The progress bar is 4/5 full at anime that have no ending episode amount
            // To keep the overview understandable, it'll be there even if there are
            // not that much episodes that have been watched
            return 0.8;
          }

          const percent = item.progress / item.media.episodes;
          // JavaScript is not trustworthy...
          return Number(percent);
        }

        if (this.currentSort.field === 'season') {
          return new Date(
            item.media.startDate.year,
            item.media.startDate.month - 1,
            item.media.startDate.day,
          );
        }

        return _.get(item, this.currentSort.field);
      }], [this.currentSort.direction]);

      return _.slice(orderedListItems, this.currentOffset, (this.currentOffset + this.listLimit));
    },
  },

  filters: {
    score: value => (value <= 0 ? '-' : value),
    episode: value => (!value || value <= 0 ? '?' : value),
  },

  mounted() {
    // $('.ui.status.dropdown', this.$el).dropdown({ onChange: this.changeAnimeStatus });
    // $('.ui.score.dropdown', this.$el).dropdown({ onChange: this.changeScore });
  },

  updated() {
    // $('.ui.status.dropdown', this.$el).dropdown({ onChange: this.changeAnimeStatus });
    // $('.ui.score.dropdown', this.$el).dropdown({ onChange: this.changeScore });
  },

  data() {
    return {
      updateTimer: null,
      updateTimeoutInterval: 500,
      updatePayload: [],
      episodeChanged: false,
      statusChanged: false,
      scoreChanged: false,

      currentSort: {
        field: 'media.title.userPreferred',
        direction: 'asc',
      },
      currentOffset: 0,
      listLimit: 100,

      finishedHighlight: false,
      fab: null,

      pagination: {
        sortBy: 'title',
        rowsPerPage: 100,
        currentPage: 1,
      },

      // scores: [{
      //   text: '-',
      //   value: 0,
      // }, {
      //   text: '1',
      //   value: 1,
      // }, {
      //   text: '2',
      //   value: 2,
      // }, {
      //   text: '3',
      //   value: 3,
      // }, {
      //   text: '4',
      //   value: 4,
      // }, {
      //   text: '5',
      //   value: 5,
      // }, {
      //   text: '6',
      //   value: 6,
      // }, {
      //   text: '7',
      //   value: 7,
      // }, {
      //   text: '8',
      //   value: 8,
      // }, {
      //   text: '9',
      //   value: 9,
      // }, {
      //   text: '10',
      //   value: 10,
      // }],
    };
  },

  methods: {
    getTimeByTimestamp(value) {
      if (!value) {
        return '-';
      }

      return this.$moment(value, 'X').fromNow();
    },
    // ...mapActions('myAnimeList', ['detectAndSetMALData']),
    // ...mapMutations('myAnimeList', ['setInformation']),
    // ...mapMutations('aniList', ['setInformation']),
    ...mapMutations(['setReady']),
    orderTable(field) {
      // Easy order:
      // null -> asc -> desc -> null
      if (this.currentSort.field === field) {
        if (this.currentSort.direction === 'asc') {
          this.currentSort.direction = 'desc';
        } else {
          this.currentSort.field = null;
          this.currentSort.direction = null;
        }
        return;
      }

      this.currentSort.field = field;
      this.currentSort.direction = 'asc';
    },

    scrollUpInfinite() {
      if (this.currentOffset === 0) {
        return;
      }

      this.currentOffset -= this.listLimit;

      // To continue at the next anime
      window.scrollTo(0, document.body.scrollHeight);
    },
    scrollDownInfinite() {
      if (!this.itemsAvailable) {
        return;
      }

      // To continue at the next anime
      window.scrollTo(0, 0);

      this.currentOffset += this.listLimit;
    },

    openInformation(id) {
      EventBus.$emit('setOpenInformationId', id);
    },

    // changeScore(value, text, $selectedItem) {
    //   const id = $($selectedItem).attr('data-id');

    //   _.map(this.listItems, (item) => {
    //     if (+item.series_animedb_id !== +id) {
    //       return item;
    //     }

    //     if (value === '-') {
    //       value = 0;
    //     }

    //     item.my_score = value;
    //     this.startUpdateTimer(item);
    //     this.scoreChanged = true;
    //     return item;
    //   });
    // },

    changeAnimeStatus(value, text, $selectedItem) {
      const id = $($selectedItem).attr('data-id');

      _.map(this.listItems, (item) => {
        if (item.media.id !== id) {
          return item;
        }

        item.status = value;

        // When changed to Complete,
        // episodes should be the series's.
        if (value === 'COMPLETED') {
          item.progress = item.media.episodes <= 0
            ? item.progress
            : item.media.episodes;
          this.episodeChanged = true;
        }

        this.startUpdateTimer(item);
        this.statusChanged = true;
        return item;
      });
    },

    decreaseOneEpisode(data) {
      if (!data || data.progress === 0) {
        return;
      }

      data.progress -= 1;
      this.episodeChanged = true;
      this.startUpdateTimer(data);
    },

    increaseOneEpisode(data) {
      if
      (
        !data
        || (!!data.media.episodes && data.progress === data.media.episodes)
      ) {
        return;
      }

      data.progress += 1;
      if (data.progress === data.media.episodes) {
        data.status = 'COMPLETED';
        this.statusChanged = true;
      }
      this.episodeChanged = true;
      this.startUpdateTimer(data);
    },

    // decreaseOneStar(data) {
    //   if (!data || +data.my_score === 0) {
    //     return;
    //   }

    //   data.my_score = +data.my_score - 1;
    //   this.scoreChanged = true;
    //   this.startUpdateTimer(data);
    // },

    // increaseOneStar(data) {
    //   if (!data || (!!+data.my_score && +data.my_score === 10)) {
    //     return;
    //   }

    //   data.my_score = +data.my_score + 1;
    //   this.scoreChanged = true;
    //   this.startUpdateTimer(data);
    // },

    startUpdateTimer(data) {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      const entry = {
        id: data.id,
        mediaId: data.media.id,
        title: data.media.title.userPreferred,
        progress: data.progress,
        status: data.status,
        score: data.score,
        changeFrom: Date.now(),
      };

      this.updatePayload.push(entry);

      this.updateTimer = setTimeout(this.updateChanges, this.updateTimeoutInterval);
    },

    async updateChanges() {
      if (_.isEmpty(this.updatePayload)) {
        return;
      }

      // As the whole list has to be re-rendered partially,
      // the user should not be able to do something during
      // that session of re-fetching data.
      if (this.statusChanged) {
        this.setReady(false);
      }

      // Group entries by their ID and reduce to the latest change
      // that has all relevant changes
      const entries = _.chain(this.updatePayload)
        .groupBy(value => value.id)
        .map(group => _.reduce(group, (accumulator, item) => (
          item.changeFrom > accumulator.changeFrom ? item : accumulator), { changeFrom: 0 }))
        .value();

      await Promise.each(entries, async (entry) => {
        const { id, title, status, progress, score } = entry;

        return this.$http.updateAnimeInList(
          { id, status, progress, score }, this.session.access_token,
        )
          .then((response) => {
            if (response.data.SaveMediaListEntry.id) {
              this.$notify({
                title: this.$t('system.constants.updated.title'),
                text: this.$t('system.constants.updated.text', { title }),
              });
            }
          })
          .catch((error) => {
            this.$notify({
              type: 'err',
              title: this.$t('system.constants.errorResponseTitle'),
              text: error,
            });
          });
      })
        .finally(() => {
          // Since we only need to re-render
          // when the status has changed
          // we only trigger the refresh then.
          if (this.statusChanged) {
            this.$emit('refresh');
          }
          this.updatePayload = [];
          this.statusChanged = false;
          this.episodeChanged = false;
          this.scoreChanged = false;
        });
    },

    progressMaxEpisodes(data) {
      if (!data.media.episodes || data.media.episodes <= 0) {
        return data.progress + (data.progress * 0.2);
      }

      return data.media.episodes;
    },

    getSeason(year, season) {
      let temp = '';

      if (!season) {
        temp = '';
      } else {
        temp = `${this.$t(`system.constants.${season.toLowerCase()}`)} `;
      }

      if (!year) {
        temp = `${temp}?`;
      } else {
        temp = `${temp}${year}`;
      }

      return temp;
    },
  },
};
</script>

<style lang="scss" scoped>
.disable-progress-margin {
  margin: 0;
}


table {
  border: 0;
}
td.blue {
  color: rgb(0, 122, 170);
}

td > .ui.dropdown > .text > i.stop.icon,
td > .ui.dropdown > .menu > .item > i.stop.icon {
  margin-right: 0;
}

td.episodeRow,
td.scoreRow {
  position: relative;

  & > .controlIcons {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;

    & > span {
      opacity: 0;
      width: 50%;
      height: 100%;
      margin: auto;
      position: absolute;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      transition: opacity .25s ease-out;

      &:hover {
        opacity: 1;
      }

      & > i.icon {
        margin: auto;
        height: 100%;
        flex: 1 0 1;
      }

      & > div.preview {
        color: white;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        flex-grow: 2;
        height: 100%;

        & > span {
          &.episode-arrow {
            margin-bottom: -2px;
          }

          &.new-status {
            margin-top: -2px;
          }

          & > i.icon {
            height: initial;
            margin-right: 0;
          }
        }
      }

      &.red {
        background-color: rgb(219, 40, 40);

        & > div.preview {
          padding-left: 5px;
        }
      }

      &.green {
        right: 0;
        background-color: rgb(33, 186, 69);

        & > div.preview {
          padding-right: 5px;
          text-align: right;
        }
      }
    }
  }
}

tr {
  cursor: pointer;
}

progress[value] {
  -webkit-appearance: none;
  vertical-align: -webkit-baseline-middle;
}

progress[value]::-webkit-progress-bar,
progress[value]::-webkit-progress-value {
  border-radius: 1em;
  height: 5px;
}

progress[value]::-webkit-progress-bar {
  background-color: #aaaaaa;
}

progress[value]::-webkit-progress-value {
  background-color: #00AAEE;
}
</style>
