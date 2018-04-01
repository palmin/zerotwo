<template>
  <table class="ui compact single line selectable celled table">
    <thead>
      <tr>
        <th class="collapsing"></th>
        <th>{{ $t('animeTitle') }}</th>
        <th class="collapsing center aligned">{{ $t('progress') }}</th>
        <th class="collapsing center aligned">
          {{ $t('score') }}
        </th>
        <th class="collapsing center aligned">{{ $t('season') }}</th>
        <th class="collapsing right aligned">{{ $t('lastUpdated') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(data, index) in listItems" :key="data.series_animedb_id">
        <td class="collapsing center aligned">
          <div class="ui inline dropdown">
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
        <td class="collapsing center aligned episodeRow">
          <progress :value="data.my_watched_episodes" :max="progressMaxEpisodes(data)" />
          {{ data.my_watched_episodes }} / {{ data.series_episodes | episode }}
          <i class="small red minus icon"
            :class="{ disabled: +data.my_watched_episodes === 0 }"
            @click="decreaseOneEpisode(data)" />
          <i class="small green plus icon"
            :class="{
              disabled: !!+data.series_episodes &&
              +data.my_watched_episodes === +data.series_episodes
            }"
            @click="increaseOneEpisode(data)" />
        </td>
        <td class="collapsing center aligned scoreRow">
          {{ data.my_score | score }}
          <i class="small red minus icon"
            :class="{ disabled: +data.my_score === 0 }"
            @click="decreaseOneStar(data)" />
          <i class="small green plus icon"
            :class="{ disabled: !!+data.my_score && +data.my_score === 10 }"
            @click="increaseOneStar(data)" />
        </td>
        <td class="collapsing center aligned">
          {{ getSeason(data.series_start) }}
        </td>
        <td class="collapsing right aligned">{{ $getMoment(+data.my_last_updated * 1000).fromNow() }}</td>
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
    },
  },

  components: { InfoBox },

  computed: {
    ...mapState('myAnimeList', ['auth']),
  },

  filters: {
    score: value => (+value <= 0 ? '-' : +value),
    episode: value => (+value <= 0 ? '?' : +value),
  },

  mounted() {
    $('.ui.dropdown', this.$el).dropdown({
      onChange: this.changeAnimeStatus,
    });
  },

  updated() {
    $('.ui.dropdown', this.$el).dropdown({
      onChange: this.changeAnimeStatus,
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
    };
  },

  methods: {
    ...mapActions('myAnimeList', ['detectAndSetMALData']),
    ...mapMutations('myAnimeList', ['setInformation']),
    ...mapMutations(['setReady']),
    openInformation(name) {
      this.setInformation(name);
    },

    changeAnimeStatus(value, text, $selectedItem) {
      const id = $($selectedItem).attr('data-id');

      _.map(this.listItems, (item) => {
        if (+item.series_animedb_id !== +id) {
          return item;
        }

        const entry = {
          series_animedb_id: item.series_animedb_id,
          series_title: item.series_title,
          my_watched_episodes: item.my_watched_episodes,
          my_status: value,
          my_score: item.my_score,
        };

        this.startUpdateTimer(entry);
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

  &:hover > i.icon:not(.disabled) {
    opacity: 1!important;
  }

  &:hover > i.icon.disabled {
    opacity: .45!important;
  }

  & > i.icon {
    position: absolute;
    margin-top: .125rem;
    top: 0;
    opacity: 0!important;
    transition: opacity .25s ease-out;
    text-shadow: 0px 0px 2px;

    &.red.minus {
      left: 0;
      margin-left: .125rem;
    }

    &.green.plus {
      right: 0;
      margin-right: .125rem;
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
    "canceled": "Canceled",
    "planned": "Planned"
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
    "canceled": "Abgebrochen",
    "planned": "Geplant"
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
    "canceled": "止めました",
    "planned": "見るつもり"
  }
}
</i18n>
