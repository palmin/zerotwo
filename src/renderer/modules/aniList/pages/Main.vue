<template>
  <v-content>
    <list-component :listItems="anime" @refresh="refreshData" />
  </v-content>
</template>

<script>
import _ from 'lodash';
import { mapState, mapActions, mapMutations } from 'vuex';
import ListComponent from '../components/List';

export default {
  props: ['status'],
  components: { ListComponent },

  methods: {
    ...mapMutations(['setReady']),
    ...mapActions('aniList', ['detectAndSetAniData']),
    getAnime() {
      if (!this.aniData || !this.aniData.lists) {
        return [];
      }

      return _.chain(this.aniData.lists)
        .find(list => list.status === this.status || (this.status === 'CURRENT' && list.status === 'REPEATING'))
        .value();
    },

    async refreshData() {
      await this.setReady(false);
      this.detectAndSetAniData()
        .then(() => this.populateAnime())
        .finally(() => this.setReady(true));
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
    status() {
      this.refreshData();
    },
  },

  mounted() {
    this.populateAnime();
  },

  computed: { ...mapState('aniList', ['aniData']) },
};
</script>
