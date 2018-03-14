<template>
  <table class="ui compact single line celled table">
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
      <tr v-for="(data, index) in listItems" :key="index">
        <td>
          <i class="stop icon" :class="{
            green: Number(data.my_status.text) === 1,
            blue: Number(data.my_status.text) === 2,
            yellow: Number(data.my_status.text) === 3,
            red: Number(data.my_status.text) === 4,
            outline: Number(data.my_status.text) === 6
          }"></i>
        </td>
        <td>{{ data.series_title.text }}</td>
        <td class="collapsing">
          <progress :value="data.my_watched_episodes.text" :max="data.series_episodes.text" />
          {{ data.my_watched_episodes.text }} / {{ data.series_episodes.text }}
        </td>
        <td class="collapsing center aligned">
          {{ data.my_score.text | score }}
        </td>
        <td class="collapsing center aligned">
          {{ getSeason(data.series_start.text) }}
        </td>
        <td class="collapsing right aligned">{{ $getMoment(+data.my_last_updated.text * 1000).fromNow() }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['listItems'],

  filters: {
    score: value => (value <= 0 ? '-' : value),
  },

  methods: {
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
    "dateFormat": "MMM DD YYYY"
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
    "dateFormat": "DD[.] MMM YYYY"
  }
}
</i18n>
