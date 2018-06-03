import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  beforeDestroy() {
    this.setTimerRunning(false);
    clearInterval(this.timer);
  },
  computed: {
    ...mapState('aniList', ['refreshRate', 'timeUntilNextRefresh', 'timerRunning', 'session']),
    ...mapGetters('aniList', ['isAuthenticated']),
  },
  async mounted() {
    if (!this.isAuthenticated) {
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
    ...mapActions('aniList', ['detectAndSetAniData', 'setTimeUntilNextRefresh', 'setTimerRunning', 'getUser']),
    ...mapMutations('aniList', ['SET_USER']),
    async timerAction() {
      await this.setTimeUntilNextRefresh(this.timeUntilNextRefresh - 1000);
      if (this.timeUntilNextRefresh <= 0) {
        const refreshInterval = this.refreshRate * 60 * 1000;
        await this.detectAndSetAniData();
        await this.setTimeUntilNextRefresh(refreshInterval);
      }
    },
    async refreshTimer() {
      if (!this.isAuthenticated) {
        return;
      }

      const refreshInterval = this.refreshRate * 60 * 1000;
      await this.detectAndSetAniData();
      await this.setTimeUntilNextRefresh(refreshInterval);
      clearInterval(this.timer);
      this.timer = setInterval(this.timerAction, 1000);
    },
  },
  watch: {
    isAuthenticated(value) {
      if (!value) {
        this.setTimerRunning(false);
      } else {
        this.setTimerRunning(true);
        this.getUser()
          .then((user) => {
            this.SET_USER(user);
          });
      }
    },
    refreshRate() {
      this.refreshTimer();
    },
    timerRunning(running) {
      if (!running) {
        // Cause timers are magically starting...
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < 3000; i++) {
          clearInterval(i);
        }
      }

      if (running) {
        this.refreshTimer();
      }
    },
  },
};
