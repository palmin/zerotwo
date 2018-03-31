<template>
  <div class="ui top fixed menu">
    <router-link class="item" tag="a" :to="{ name: 'Airing' }" active-class="active" exact>
      {{ $t('airing') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Finished' }" active-class="active" exact>
      {{ $t('completed') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'OnHold' }" active-class="active" exact>
      {{ $t('onHold') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Canceled' }" active-class="active" exact>
      {{ $t('canceled') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Planned' }" active-class="active" exact>
      {{ $t('planned') }}
    </router-link>
    <div class="right menu">
      <search-box :openInformation="openInformation" />
      <a class="ui item" :class="{ disabled: !this.auth }" @click="refreshMAL">
        <i class="refresh icon" :class="{ loading: !isReady }"></i>
        {{ $t('refreshMAL') }} {{ readableTimeUntilNextRefresh }}
      </a>
      <a class="ui item" @click="openSettings">
        <i class="settings icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchBox from './SearchBox';

export default {
  props: ['openSettings', 'refreshMAL', 'openInformation'],
  components: { SearchBox },
  computed: {
    ...mapState(['isReady']),
    ...mapState('myAnimeList', ['timeUntilNextRefresh', 'auth']),
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '';
      }

      return `(${this.$getMoment(this.timeUntilNextRefresh).format('mm:ss')})`;
    },
  },
};
</script>

<style scoped>
.ui.top.fixed.menu {
  position: sticky;
}
</style>

<i18n>
{
  "en": {
    "animeList": "MyAnimeList",
    "refreshMAL": "Refresh MAL",
    "airing": "Airing",
    "completed": "Completed",
    "onHold": "On Hold",
    "canceled": "Canceled",
    "planned": "Planned",
    "notInList": "Not in your list",
    "searchAnime": "Search...",
    "noResults": "No results could be found"
  },
  "de": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MAL aktualisieren",
    "airing": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "canceled": "Abgebrochen",
    "planned": "Geplant",
    "notInList": "Nicht in deiner Liste",
    "searchAnime": "Suchen ...",
    "noResults": "Es wurden keine Ergebnisse gefunden"
  },
  "ja": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MALを更新",
    "airing": "見る",
    "completed": "終了",
    "onHold": "中止",
    "canceled": "止めました",
    "planned": "見るつもり",
    "notInList": "リストにはありません",
    "searchAnime": "検索 ...",
    "noResults": "結果は見つかりませんでした。"
  }
}
</i18n>
