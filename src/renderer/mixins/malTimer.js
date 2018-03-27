import { mapState, mapActions } from 'vuex';

export default {
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapState('myAnimeList', ['refreshRate', 'timeUntilNextRefresh']),
  },
  mounted() {
    this.refreshTimer();
  },
  data() {
    return {
      timer: null,
    };
  },
  methods: {
    ...mapActions('myAnimeList', ['detectAndSetMALData', 'setTimeUntilNextRefresh']),
    async timerAction() {
      await this.setTimeUntilNextRefresh(this.timeUntilNextRefresh - 1000);
      if (this.timeUntilNextRefresh <= 0) {
        await this.detectAndSetMALData();
        await this.setTimeUntilNextRefresh(this.refreshRate * 60 * 1000);
      }
    },
    async refreshTimer() {
      if (this.timer) {
        clearInterval(this.timer);
      }

      const refreshInterval = this.refreshRate * 60 * 1000;
      await this.detectAndSetMALData();
      await this.setTimeUntilNextRefresh(refreshInterval);

      this.timer = setInterval(this.timerAction, 1000);
    },
  },
  watch: {
    refreshRate() {
      this.refreshTimer();
    },
  },
};
