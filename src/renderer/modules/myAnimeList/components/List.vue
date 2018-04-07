<template>
  <table class="ui compact single line selectable sortable celled table">
    <thead>
      <tr>
        <th class="collapsing"></th>

        <th @click="orderTable('series_title')">
          {{ $t('animeTitle') }}
          <i class="sort alphabet icon"
            :class="{ down: currentSort.direction === 'asc', up: currentSort.direction === 'desc' }"
            v-if="currentSort.field === 'series_title'"
          ></i>
        </th>

        <th @click="orderTable('progress')" class="collapsing center aligned">
          {{ $t('progress') }}
          <i class="sort icon"
            :class="{ down: currentSort.direction === 'asc', up: currentSort.direction === 'desc' }"
            v-if="currentSort.field === 'progress'"
          ></i>
        </th>

        <th @click="orderTable('my_score')" class="collapsing center aligned">
          {{ $t('score') }}
          <i class="sort numeric icon"
            :class="{ down: currentSort.direction === 'asc', up: currentSort.direction === 'desc' }"
            v-if="currentSort.field === 'my_score'"
          ></i>
        </th>

        <th @click="orderTable('series_start')" class="collapsing center aligned">
          {{ $t('season') }}
          <i class="sort icon"
            :class="{ down: currentSort.direction === 'asc', up: currentSort.direction === 'desc' }"
            v-if="currentSort.field === 'series_start'"
          ></i>
        </th>

        <th class="collapsing right aligned">{{ $t('lastUpdated') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="currentOffset !== 0">
        <td class="center aligned" colspan="6" @click="scrollUpInfinite">
          {{ $t('loadMore') }}
        </td>
      </tr>

      <tr v-for="data in list" :key="data.series_animedb_id">

        <td class="collapsing center aligned">
          <div class="ui status inline dropdown">
            <div class="text">
              <i class="stop icon" :class="{
                green: Number(data.my_status) === 1,
                blue: Number(data.my_status) === 2,
                yellow: Number(data.my_status) === 3,
                red: Number(data.my_status) === 4,
                black: Number(data.my_status) === 6
              }"></i>
            </div>
            <div class="menu">
              <div class="item" :data-value="1" :data-id="data.series_animedb_id"><i class="green stop icon"></i></div>
              <div class="item" :data-value="2" :data-id="data.series_animedb_id"><i class="blue stop icon"></i></div>
              <div class="item" :data-value="3" :data-id="data.series_animedb_id"><i class="yellow stop icon"></i></div>
              <div class="item" :data-value="4" :data-id="data.series_animedb_id"><i class="red stop icon"></i></div>
              <div class="item" :data-value="6" :data-id="data.series_animedb_id"><i class="black stop icon"></i></div>
            </div>
          </div>
        </td>
        <td @click="openInformation(data.series_title)">{{ data.series_title }}</td>

        <td class="collapsing episodeRow">
          <progress :value="data.my_watched_episodes" :max="progressMaxEpisodes(data)" />
          {{ data.my_watched_episodes }} / {{ data.series_episodes | episode }}
          <div class="controlIcons">
            <span class="red" @click="decreaseOneEpisode(data)" v-if="+data.my_watched_episodes !== 0">
              <div class="preview">
                <span class="episode-arrow" v-if="+data.my_watched_episodes !== 0">
                  {{ +data.my_watched_episodes - 1 }}
                  <i class="inverted left arrow icon" />
                  {{ +data.my_watched_episodes }}
                </span>
              </div>
              <i class="inverted minus icon"
                :class="{ disabled: +data.my_watched_episodes === 0 }" />
            </span>

            <span class="green" @click="increaseOneEpisode(data)">
              <i class="inverted plus icon"
                :class="{
                  disabled: !!+data.series_episodes &&
                  +data.my_watched_episodes === +data.series_episodes
                }" />
              <div class="preview">
                <span class="episode-arrow" v-if="(+data.series_episodes > 0 && +data.my_watched_episodes < +data.series_episodes) || +data.series_episodes <= 0">
                  {{ +data.my_watched_episodes }}
                  <i class="inverted right arrow icon" />
                  {{ +data.my_watched_episodes + 1 }}
                </span>
                <span class="new-status" v-if="(+data.series_episodes > 0 && +data.my_watched_episodes + 1 === +data.series_episodes)">
                  {{ $t('toFinished') }}
                </span>
              </div>
            </span>
          </div>
        </td>

        <td class="collapsing center aligned scoreRow">
          <div class="ui score scrolling compact dropdown">
            <input type="hidden" name="score" :value="data.my_score">
            <div class="default text">-</div>
            <div class="menu">
              <div class="item" :data-value="0" :data-id="data.series_animedb_id">-</div>
              <div class="item" :data-value="1" :data-id="data.series_animedb_id">1</div>
              <div class="item" :data-value="2" :data-id="data.series_animedb_id">2</div>
              <div class="item" :data-value="3" :data-id="data.series_animedb_id">3</div>
              <div class="item" :data-value="4" :data-id="data.series_animedb_id">4</div>
              <div class="item" :data-value="5" :data-id="data.series_animedb_id">5</div>
              <div class="item" :data-value="6" :data-id="data.series_animedb_id">6</div>
              <div class="item" :data-value="7" :data-id="data.series_animedb_id">7</div>
              <div class="item" :data-value="8" :data-id="data.series_animedb_id">8</div>
              <div class="item" :data-value="9" :data-id="data.series_animedb_id">9</div>
              <div class="item" :data-value="10" :data-id="data.series_animedb_id">10</div>
            </div>
          </div>
        </td>

        <td class="collapsing center aligned">
          {{ getSeason(data.series_start) }}
        </td>

        <td class="collapsing right aligned">{{ $getMoment(+data.my_last_updated * 1000).fromNow() }}</td>
      </tr>

      <tr v-if="itemsAvailable">
        <td class="center aligned" colspan="6" @click="scrollDownInfinite">
          {{ $t('loadMore') }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import _ from 'lodash';
import Promise from 'bluebird';
import { Builder } from 'xml2js';
import { mapState, mapMutations, mapActions } from 'vuex';
import InfoBox from '@/components/InformationModal';

export default {
  props: ['listItems'],

  watch: {
    listItems(list) {
      if (!list) {
        return;
      }

      this.setReady(true);
      this.$forceUpdate();
    },
  },

  components: {
    InfoBox,
  },

  computed: {
    ...mapState('myAnimeList', ['auth']),
    itemsAvailable() {
      return (this.currentOffset + this.listLimit) < this.listItems.length;
    },
    list() {
      if (this.currentSort.field === null) {
        return _.slice(this.listItems, this.currentOffset, (this.currentOffset + this.listLimit));
      }

      const orderedListItems = _.orderBy(this.listItems, [(item) => {
        if (this.currentSort.field === 'my_score') {
          // We need to return it as a number
          // because otherwise lodash compares it as a string
          // which would make 10's < 2's
          return Number(item.my_score);
        }

        if (this.currentSort.field === 'progress') {
          if (+item.my_watched_episodes === 0) {
            // Early return here to prevent the case
            // that if it still has no ending episode amount
            // it returns 4/5 even though no episode has been watched yet.
            // tl;dr: Not yet watched? It's 0% then.
            return 0;
          }
          if (+item.series_episodes <= 0) {
            // The progress bar is 4/5 full at anime that have no ending episode amount
            // To keep the overview understandable, it'll be there even if there are
            // not that much episodes that have been watched
            return 0.8;
          }

          const percent = item.my_watched_episodes / item.series_episodes;
          // JavaScript is not trustworthy...
          return Number(percent);
        }

        return item[this.currentSort.field];
      }], [this.currentSort.direction]);

      return _.slice(orderedListItems, this.currentOffset, (this.currentOffset + this.listLimit));
    },
  },

  filters: {
    score: value => (+value <= 0 ? '-' : +value),
    episode: value => (+value <= 0 ? '?' : +value),
  },

  mounted() {
    $('.ui.status.dropdown', this.$el).dropdown({
      onChange: this.changeAnimeStatus,
    });
    $('.ui.score.dropdown', this.$el).dropdown({
      onChange: this.changeScore,
    });
  },

  updated() {
    $('.ui.status.dropdown', this.$el).dropdown({
      onChange: this.changeAnimeStatus,
    });
    $('.ui.score.dropdown', this.$el).dropdown({
      onChange: this.changeScore,
    });
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
        field: null,
        direction: null,
      },
      currentOffset: 0,
      listLimit: 100,
    };
  },

  methods: {
    ...mapActions('myAnimeList', ['detectAndSetMALData']),
    ...mapMutations('myAnimeList', ['setInformation']),
    ...mapMutations(['setReady']),
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

    openInformation(name) {
      this.setInformation(name);
    },

    changeScore(value, text, $selectedItem) {
      const id = $($selectedItem).attr('data-id');

      _.map(this.listItems, (item) => {
        if (+item.series_animedb_id !== +id) {
          return item;
        }

        if (value === '-') {
          value = 0;
        }

        item.my_score = value;
        this.startUpdateTimer(item);
        this.scoreChanged = true;
        return item;
      });
    },

    changeAnimeStatus(value, text, $selectedItem) {
      const id = $($selectedItem).attr('data-id');

      _.map(this.listItems, (item) => {
        if (+item.series_animedb_id !== +id) {
          return item;
        }

        item.my_status = value;

        // When changed to Complete,
        // episodes should be the series's.
        if (+value === 2) {
          item.my_watched_episodes = +item.series_episodes <= 0
            ? +item.my_watched_episodes
            : +item.series_episodes;
          this.episodeChanged = true;
        }

        this.startUpdateTimer(item);
        this.statusChanged = true;
        return item;
      });
    },

    decreaseOneEpisode(data) {
      if (!data || +data.my_watched_episodes === 0) {
        return;
      }

      data.my_watched_episodes = +data.my_watched_episodes - 1;
      this.episodeChanged = true;
      this.startUpdateTimer(data);
    },

    increaseOneEpisode(data) {
      if
      (
        !data
        || (!!+data.series_episodes && +data.my_watched_episodes === +data.series_episodes)
      ) {
        return;
      }

      data.my_watched_episodes = +data.my_watched_episodes + 1;
      if (+data.my_watched_episodes === +data.series_episodes) {
        data.my_status = 2;
        this.statusChanged = true;
      }
      this.episodeChanged = true;
      this.startUpdateTimer(data);
    },

    decreaseOneStar(data) {
      if (!data || +data.my_score === 0) {
        return;
      }

      data.my_score = +data.my_score - 1;
      this.scoreChanged = true;
      this.startUpdateTimer(data);
    },

    increaseOneStar(data) {
      if (!data || (!!+data.my_score && +data.my_score === 10)) {
        return;
      }

      data.my_score = +data.my_score + 1;
      this.scoreChanged = true;
      this.startUpdateTimer(data);
    },

    startUpdateTimer(data) {
      if (this.updateTimer) {
        clearTimeout(this.updateTimer);
      }

      const entry = {
        id: data.series_animedb_id,
        title: data.series_title,
        episode: data.my_watched_episodes,
        status: data.my_status,
        score: data.my_score,
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
        .map(group => _.reduce(group, (accumulator, item) =>
          (item.changeFrom > accumulator.changeFrom ? item : accumulator), { changeFrom: 0 }))
        .value();

      const builder = new Builder({ rootName: 'entry' });
      await Promise.each(entries, async (entry) => {
        const { id, title } = entry;

        const xml = builder.buildObject(entry);
        return this.$http.updateAnime(this.auth, { id, xml })
          .then((response) => {
            if (response === 'Updated') {
              this.$notify({
                title: this.$t('updated.title'),
                text: this.$t('updated.text', { title }),
              });
            }
          })
          .catch((error) => {
            this.$notify({
              type: 'error',
              title: this.$t('errorResponseTitle'),
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
      if (data.series_episodes <= 0) {
        return +data.my_watched_episodes + +(+data.my_watched_episodes * 0.2);
      }

      return data.series_episodes;
    },

    getSeason(date) {
      const seasons = [this.$t('winter'), this.$t('spring'), this.$t('summer'), this.$t('autumn')];
      const dateMonth = Math.floor(new Date(date).getMonth() / 3);
      const dateYear = new Date(date).getFullYear();
      const season = seasons[dateMonth];

      if (isNaN(dateYear) || season === undefined) {
        return date.split('-')[0];
      }

      return `${season} ${dateYear}`;
    },
  },
};
</script>

<style lang="scss" scoped>
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


<i18n>
{
  "en": {
    "animeTitle": "Anime Title",
    "progress": "Progress",
    "score": "Score",
    "season": "Season",
    "lastUpdated": "Last Updated",
    "winter": "Winter",
    "spring": "Spring",
    "summer": "Summer",
    "autumn": "Autumn",
    "dateFormat": "MMM DD YYYY",
    "loading": "Loading",
    "updated": {
      "title": "Anime updated!",
      "text": "{title} was successfully updated!"
    },
    "errorResponseTitle": "Update not successful!",
    "watching": "Watching",
    "finished": "Finished",
    "onHold": "On Hold",
    "dropped": "Dropped",
    "planned": "Planned",
    "toFinished": "Finish",
    "loadMore": "Load more..."
  },
  "de": {
    "animeTitle": "Animetitel",
    "progress": "Fortschritt",
    "score": "Bewertung",
    "season": "Saison",
    "lastUpdated": "Zuletzt aktualisiert",
    "winter": "Winter",
    "spring": "Frühling",
    "summer": "Sommer",
    "autumn": "Herbst",
    "dateFormat": "DD[.] MMM YYYY",
    "loading": "Lädt",
    "updated": {
      "title": "Anime aktualisiert!",
      "text": "{title} wurde erfolgreich aktualisiert!"
    },
    "errorResponseTitle": "Aktualisierung nicht erfolgreich!",
    "watching": "Laufend",
    "finished": "Beendet",
    "onHold": "Pausiert",
    "dropped": "Abgebrochen",
    "planned": "Geplant",
    "toFinished": "Beendet",
    "loadMore": "Mehr Elemente laden..."
  },
  "ja": {
    "animeTitle": "アニメのタイトル",
    "progress": "進行",
    "score": "評価",
    "season": "シーズン",
    "lastUpdated": "最新更新",
    "winter": "冬",
    "spring": "春",
    "summer": "夏",
    "autumn": "秋",
    "dateFormat": "MMM DD YYYY",
    "loading": "通信中",
    "updated": {
      "title": "更新成功！",
      "text": "「{title}」の更新は成功しました！"
    },
    "errorResponseTitle": "シンクロは出来ませんでした！",
    "watching": "見る",
    "finished": "終了",
    "onHold": "中止",
    "dropped": "止めました",
    "planned": "見るつもり",
    "toFinished": "終了",
    "loadMore": "次のリストデータ・・・"
  }
}
</i18n>
