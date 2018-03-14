<template>
  <div>
    <list-component :listItems="malData" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ListComponent from '../components/List';

export default {
  components: { ListComponent },
  computed: {
    ...mapState('myAnimeList', ['malData']),
  },
};
</script>
