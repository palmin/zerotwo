<template>
  <div>
    <list-component :listItems="completedAnime" />
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
    completedAnime() {
      return _.chain(this.malData)
        .filter(item => Number(item.my_status) === 2)
        .sortBy(item => item.series_title.toLowerCase())
        .value();
    },
  },
};
</script>
