<template>
  <table class="ui compact celled table">
    <thead>
      <tr>
        <th class="collapsing"></th>
        <th>{{ $t('animeTitle') }}</th>
        <th>{{ $t('progress') }}</th>
        <th>{{ $t('score') }}</th>
        <th>{{ $t('season') }}</th>
        <th>{{ $t('lastUpdated') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="data in dummyData" :key="data.title">
        <td>
          <i class="bell icon" :class="{ outline: data.status === 2 }"></i>
        </td>
        <td>{{ data.title }}</td>
        <td>{{ data.progress }}</td>
        <td>{{ data.score }}</td>
        <td>{{ data.season }}</td>
        <td>{{ data.lastUpdated.toDateString() }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const AIRING = 1;
const NOT_AIRING = 2;

export default {
  data() {
    return {
      dummyData: [
        {
          status: AIRING,
          title: 'Darling in the FRANXX',
          progress: 10,
          episodes: 13,
          score: 8.5,
          season: 'Winter 2018',
          lastUpdated: new Date(),
        },
        {
          status: NOT_AIRING,
          title: 'Saki',
          progress: 24,
          episodes: 24,
          score: 10,
          season: 'Winter 2009',
          lastUpdated: new Date(),
        },
      ],
    };
  },
};
</script>

<i18n>
{
  "en": {
    "animeTitle": "Anime Title",
    "progress": "Progress",
    "score": "Score",
    "season": "Season",
    "lastUpdated": "Last Updated"
  },
  "de": {
    "animeTitle": "Animetitel",
    "progress": "Fortschritt",
    "score": "Bewertung",
    "season": "Saison",
    "lastUpdated": "Zuletzt aktualisiert"
  }
}
</i18n>
