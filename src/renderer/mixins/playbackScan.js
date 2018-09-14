// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron';
import os from 'os';
import { mapState } from 'vuex';

export default {
  computed: {
    isUnix() {
      return os.platform() !== 'win32';
    },
    ...mapState('playback', ['software']),
  },
  mounted() {
    this.timer = setInterval(this.checkForOpenedSoftware, this.timeInterval);
  },
  methods: {
    checkForOpenedSoftware() {
      // Only for Linux and macOS right now
      if (!this.isUnix()) {
        return;
      }

      if (this.software instanceof Array) {
        const output = [];
        this.software.forEach((item) => {
          // get the output of all programs that are currently set as playback software
          output.push(shell(`lsof ${item}`));
        });
      }
    },
  },
  data() {
    return {
      timer: null,
      timeInterval: 1000,
    };
  },
};
