import { mapState, mapActions } from 'vuex';

export default {
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapState('myAnimeList', ['auth', 'refreshRate', 'timeUntilNextRefresh', 'timerRunning']),
  },
  async mounted() {
    if (!this.auth) {
      await this.setTimerRunning(false);
      return;
    }

    this.refreshTimer();
  },
  data() {
    return {
      timer: null,
    };
  },
  methods: {
    ...mapActions('myAnimeList', ['detectAndSetMALData', 'setTimeUntilNextRefresh', 'setTimerRunning']),
    async timerAction() {
      await this.setTimeUntilNextRefresh(this.timeUntilNextRefresh - 1000);
      if (this.timeUntilNextRefresh <= 0) {
        await this.detectAndSetMALData();
        await this.setTimeUntilNextRefresh(this.refreshRate * 60 * 1000);
      }
    },
    async refreshTimer() {
      if (!this.auth) {
        return;
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
    timerRunning(running) {
      if (!running && this.timer) {
        clearInterval(this.timer);
      }

      if (running) {
        this.refreshTimer();
      }
    },
  },
};
