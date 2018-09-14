<template>
  <v-tab-item key="appSettings">
    <v-card flat>
      <v-container fluid>
        <v-flex xs12>
          <h5 class="headline font-weight-light font-italic">{{ $t('system.settings.menu.restoreFactoryData') }}</h5>
          <v-divider></v-divider>
          <v-btn dark color="primary" @click="restoreFactoryData">
            <template v-if="!confirm">{{ $t('system.settings.restoreFactoryData.restore') }}</template>
            <template v-else>{{ $t('system.settings.restoreFactoryData.confirmRestoration') }}</template>
          </v-btn>
          <v-progress-linear v-if="this.confirm" v-model="seconds" buffer-value="15"></v-progress-linear>
          <div v-if="confirm">
            {{ $t('system.settings.restoreFactoryData.pressWithinToRestore', { seconds }) }}
          </div>
        </v-flex>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script>
import { mapActions } from 'vuex';
import { setInterval, clearInterval } from 'timers';

export default {
  data: () => ({
    confirm: false,
    seconds: 0,
    timer: null,
  }),
  methods: {
    ...mapActions('aniList', ['logout']),
    restoreFactoryData() {
      if (!this.confirm) {
        this.confirm = true;
        this.seconds = 15;
        this.timer = setInterval(this.timerAction, 1000);
        return;
      }

      clearInterval(this.timer);
      this.timer = null;
      this.confirm = false;
      this.seconds = 0;
      this.logout();
    },
    timerAction() {
      if (this.confirm) {
        this.seconds -= 1;

        if (this.seconds <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.confirm = false;
          this.seconds = 0;
        }
      }
    },
  },
};
</script>
