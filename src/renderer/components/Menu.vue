<template>
  <div class="ui top fixed menu">
    <router-link class="item" tag="a" :to="{ name: 'Main' }" active-class="active" exact>
      {{ $t('allAnime') }}
    </router-link>
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
      <div class="ui right aligned search item">
        <div class="ui transparent icon input">
          <input class="prompt" type="text" :placeholder="$t('searchAnime')">
          <i class="search link icon"></i>
        </div>
        <div class="results"></div>
      </div>
      <a class="ui item" @click="openSettings">
        <i class="settings icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['openSettings'],
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
    "allAnime": "All Anime",
    "airing": "Airing Anime",
    "completed": "Completed Anime",
    "onHold": "On Hold Anime",
    "canceled": "Canceled Anime",
    "planned": "Planned Anime",
    "searchAnime": "Search Anime..."
  },
  "de": {
    "animeList": "MyAnimeList",
    "allAnime": "Alle Anime",
    "airing": "Laufende Anime",
    "completed": "Beendete Anime",
    "onHold": "Pausierte Anime",
    "canceled": "Abgebrochene Anime",
    "planned": "Geplante Anime",
    "searchAnime": "Anime suchen ..."
  }
}
</i18n>
