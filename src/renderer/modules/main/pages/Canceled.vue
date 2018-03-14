<template>
  <div>
    <list-component :listItems="canceledAnime" />
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
    canceledAnime() {
      return _.chain(this.malData)
        .filter(item => Number(item.my_status.text) === 4)
        .sortBy(item => item.series_title.text.toLowerCase())
        .value();
    },
  },
};
</script>
