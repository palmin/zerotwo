<template>
  <table class="ui compact single line selectable celled table">
    <info-box :ref="infoBox" :data="infoData" />
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
      <tr v-for="(data, index) in listItems" :key="index" @click="openInformation(data.series_title)">
        <td>
          <i class="stop icon" :class="{
            green: Number(data.my_status) === 1,
            blue: Number(data.my_status) === 2,
            yellow: Number(data.my_status) === 3,
            red: Number(data.my_status) === 4,
            black: Number(data.my_status) === 6
          }"></i>
        </td>
        <td>{{ data.series_title }}</td>
        <td class="collapsing">
          <progress :value="data.my_watched_episodes" :max="data.series_episodes" />
          {{ data.my_watched_episodes }} / {{ data.series_episodes }}
        </td>
        <td class="collapsing center aligned">
          {{ data.my_score | score }}
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
import { mapState } from 'vuex';
import InfoBox from '@/components/InformationModal';

export default {
  props: ['listItems'],

  components: { InfoBox },

  computed: {
    ...mapState('myAnimeList', ['auth']),
  },

  filters: {
    score: value => (value <= 0 ? '-' : value),
  },

  data() {
    return {
      infoBox: 'informationModal',
      infoData: {
        title: { text: '' },
        synopsis: { text: '' },
      },
    };
  },

  methods: {
    openInformation(name) {
      this.$http.findAnime(name, this.auth)
        .then((data) => {
          if (data !== null) {
            this.infoData = data;
            this.$refs[this.infoBox].show();
          }
        });
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

<style scoped>
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
    "loading": "Loading"
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
    "loading": "Lädt"
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
    "loading": "通信中"
  }
}
</i18n>
