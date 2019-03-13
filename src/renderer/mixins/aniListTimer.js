import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import API from '@/modules/api';

export default {
  beforeDestroy() {
    this.setTimerRunning(false);
    clearInterval(this.timer);
  },
  computed: {
    ...mapState('aniList', ['refreshRate', 'timeUntilNextRefresh', 'timerRunning', 'session', 'restartTimer']),
    ...mapGetters('aniList', ['isAuthenticated']),
  },
  async mounted() {
    if (!this.isAuthenticated) {
      await this.setTimerRunning(false);
      return;
    }

    this.startTimer();
  },
  data() {
    return { timer: null };
  },
  methods: {
    ...mapActions('aniList', ['detectAndSetAniData', 'setTimeUntilNextRefresh', 'setTimerRunning', 'setRestartTimer']),
    ...mapMutations('aniList', ['SET_USER']),
    ...mapMutations(['setReady']),
    async timerAction() {
      await this.setTimeUntilNextRefresh(this.timeUntilNextRefresh - 1000);
      if (this.timeUntilNextRefresh <= 0) {
        const refreshInterval = this.refreshRate * 60 * 1000;
        await this.setReady(false);
        await this.detectAndSetAniData();
        await this.setTimeUntilNextRefresh(refreshInterval);
        await this.setReady(true);
      }
    },
    async refreshTimer() {
      if (!this.isAuthenticated) {
        return;
      }

      await this.detectAndSetAniData();
      await this.startTimer();
    },
    async startTimer() {
      const refreshInterval = this.getRefreshInterval();
      await this.setTimeUntilNextRefresh(refreshInterval);
      clearInterval(this.timer);
      this.timer = setInterval(this.timerAction, 1000);
    },
    getRefreshInterval() {
      return this.refreshRate * 60 * 1000;
    },
  },
  watch: {
    isAuthenticated(value) {
      if (!value) {
        this.setTimerRunning(false);
      } else {
        this.setTimerRunning(true);
        API.getUser(this.session.access_token)
          .then((user) => {
            this.SET_USER(user);
          });
      }
    },
    restartTimer(status) {
      if (status) {
        this.startTimer();
        this.setRestartTimer(false);
      }
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
