<template>
  <v-layout child-flex>
    <v-data-table
      dark
      :headers="headers"
      :items="items"
      :pagination.sync="pagination"
      item-key="id"
      :must-sort="true"
      :no-data-text="$t('system.$vuetify.noDataText')"
      :rows-per-page-items="[pagination.rowsPerPage]"
    >
      <template slot="items" slot-scope="props">
        <td class="table-row" @click="openInformation(props.item.id)" :class="{ 'finished-airing': props.item.finishedAiring }">
          {{ props.item.title }}
          <div dark class="green--text text--accent-3" v-if="props.item.nextAiringEpisode">
            {{ $t('system.constants.airingIn', {
              episode: props.item.nextAiringEpisode.episode,
              time: getTimeByTimestamp(props.item.nextAiringEpisode.airingAt),
             }) }}
          </div>
        </td>
        <td class="text-xs-left episode-row">
          <span class="caption">
            {{ props.item.progress }} / {{ props.item.episodes | episode }}
          </span>

          <div class="episode-action">
            <v-progress-linear color="success" height="20" class="disable-progress-margin" :value="props.item.progressInPercent">
            </v-progress-linear>

            <v-btn small flat color="success" class="plus-action" @click="increaseOneEpisode(props.item.item)">
              <v-icon small>fas fa-plus</v-icon>
            </v-btn>
          </div>
        </td>
        <td class="text-xs-left">
          <v-progress-circular :value="props.item.scorePercentage" size="40" :rotate="-90"
            :color="(props.item.scorePercentage >= 70 ? 'success' : (props.item.scorePercentage < 70 && props.item.scorePercentage >= 40 ? 'warning' : 'error'))">
            {{ props.item.score }}
          </v-progress-circular>
        </td>
        <td class="text-xs-left">{{ props.item.season }}</td>
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
        width: '45%',
      }, {
        text: this.$t('system.constants.progress'),
        align: 'left',
        value: 'episode',
        width: '15%',
      }, {
        text: this.$t('system.constants.score'),
        align: 'left',
        value: 'score',
        width: '5%',
      }, {
        text: this.$t('system.constants.season'),
        align: 'left',
        value: 'season',
        width: '12.5%',
      }, {
        text: this.$t('system.constants.lastUpdated'),
        align: 'right',
        value: 'updated',
        sortable: false,
        width: '27.5%',
      }];
    },

    pageText() {
      return `${this.pagination.currentPage}`;
    },
    listEntries() {
      return this.listItems.entries;
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
        progressInPercent: this.getEpisodePercentage(item.progress, item.media.episodes),
        score: item.score,
        scorePercentage: this.scorePercentage(item.score),
        season: this.getSeason(item.media.startDate.year, item.media.season),
        updated: this.getTimeByTimestamp(item.updatedAt),
        finishedAiring: item.media.status === 'FINISHED',
        nextAiringEpisode: item.media.nextAiringEpisode,
        item,
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
    scoringSystem() {
      return this.session.user.mediaListOptions.scoreFormat;
    },
  },

  filters: {
    score: value => (value <= 0 ? '-' : value),
    episode: value => (!value || value <= 0 ? '?' : value),
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
    };
  },

  methods: {
    getTimeByTimestamp(value) {
      if (!value) {
        return '-';
      }

      return this.$moment(value, 'X').fromNow();
    },
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

    openInformation(id) {
      EventBus.$emit('setOpenInformationId', id);
    },

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

    getEpisodePercentage(progress, episodes) {
      if (!progress) {
        return 0;
      }

      if (!episodes || episodes <= 0) {
        return progress + (progress * 0.2);
      }

      return progress / episodes * 100;
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
    scorePercentage(score) {
      let percentage = 0;
      switch (this.scoringSystem) {
        case 'POINT_10':
        case 'POINT_10_DECIMAL':
          percentage = score * 10;
          break;
        case 'POINT_5':
          percentage = score * 20;
          break;
        case 'POINT_3':
          if (score === 3) {
            percentage = 100;
          } else if (score === 2) {
            percentage = 66;
          } else if (score === 1) {
            percentage = 33;
          } else {
            percentage = 0;
          }
          break;
        case 'POINT_100':
        default:
          percentage = score;
          break;
      }

      return percentage;
    },
  },
};
</script>

<style lang="scss" scoped>
.disable-progress-margin {
  margin: 0;
}

.finished-airing {
  color: #19bef0;
}

.table-row {
  cursor: pointer;
}

.episode-row {
  .episode-action {
    position: relative;

    .plus-action {
      position: absolute;
      right: -30px;
      bottom: 0;
      line-height: 20px;
      height: 20px;
      min-width: 0;
      max-width: 30px;
      margin: 0;
      display: none;
    }
  }

  &:hover .plus-action {
    display: inline-flex;
  }
}
</style>
