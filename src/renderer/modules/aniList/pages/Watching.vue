<template>
  <v-content>
    <list-component :listItems="anime" @refresh="refreshData" />
  </v-content>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions } from 'vuex';
import ListComponent from '../components/List';

export default {
  components: { ListComponent },

  methods: {
    ...mapActions('aniList', ['detectAndSetAniData']),
    getAnime() {
      if (!this.aniData.lists) {
        return [];
      }

      return _.chain(this.aniData.lists)
        .find(list => list.status === 'CURRENT' || list.status === 'REPEATING')
        .value();
    },

    refreshData() {
      this.detectAndSetAniData()
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
    aniData() {
      this.populateAnime();
    },
  },

  mounted() {
    this.populateAnime();
  },

  computed: { ...mapState('aniList', ['aniData']) },
};
</script>
