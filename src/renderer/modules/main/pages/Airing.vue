<template>
  <div>
    <list-component :listItems="airingAnime" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import ListComponent from '../components/List';

export default {
  components: { ListComponent },

  computed: {
    ...mapState('myAnimeList', ['malData']),
    airingAnime() {
      return _.chain(this.malData)
        .filter(item => Number(item.my_status) === 1)
        .sortBy(item => item.series_title.toLowerCase())
        .value();
    },
  },
};
</script>
