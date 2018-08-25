<template>
  <div>
    <list-component :listItems="anime" @refresh="refreshData" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex';
import ListComponent from '../components/List';

export default {
  components: { ListComponent },

  methods: {
    ...mapActions('myAnimeList', ['detectAndSetMALData']),
    getAnime() {
      return _.chain(this.malData)
        .filter(item => Number(item.my_status) === 4)
        .sortBy(item => item.series_title.toLowerCase())
        .value();
    },

    refreshData() {
      this.detectAndSetMALData()
        .then(() => this.populateAnime());
    },

    populateAnime() {
      this.anime = this.getAnime();
    },
  },

  data() {
    return { anime: [] };
  },

  watch: {
    malData() {
      this.populateAnime();
    },
  },

  mounted() {
    this.populateAnime();
  },

  computed: { ...mapState('myAnimeList', ['malData']) },
};
</script>
