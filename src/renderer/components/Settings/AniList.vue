<template>
  <v-tab-item key="aniList">
    <v-card flat>
      <v-container fluid>
        <v-layout
          fill-height
          justify-center
          align-center
          v-if="!isAuthenticated">
          <v-btn color="primary" @click="loginToAniList">{{ $t('system.actions.login') }}</v-btn>
        </v-layout>
        <v-layout
          fill-height
          v-else>
          <v-flex>
            <h5 class="headline font-weight-light font-italic">{{ $t('system.settings.aniList.loggedInAs') }} {{ getUsername }}</h5>
            <v-divider></v-divider>
            <a class="font-weight-thin font-italic body-1 blue--text text--lighten-4" @click="logout">{{ $t('system.actions.logout') }}</a>
            <v-container grid-list-xs>
              <v-flex xs3>
                <v-text-field
                  v-model="refreshRateValue"
                  :label="$t('system.settings.aniList.aniListRefreshRate')"
                  @input="$v.refreshRateValue.$touch()"
                  :suffix="$t('system.settings.aniList.minutes')"
                  hint="1 - 60"
                  :error="$v.refreshRateValue.$error"
                  required
                ></v-text-field>
                <v-btn
                  color="primary"
                  @click.native="editRefreshRate">
                  {{ $t('system.actions.save') }}
                </v-btn>
              </v-flex>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import { mapState, mapActions, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, between } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  validations: {
    refreshRateValue: {
      required,
      between: between(1, 60),
    },
  },
  computed: { ...mapGetters('aniList', ['isAuthenticated', 'getUsername', 'refreshRate']) },
  methods: {
    ...mapActions('aniList', ['logout', 'updateRefreshRate', 'setTimerRunning']),
    editRefreshRate() {
      this.$v.refreshRateValue.$touch();
      if (this.$v.refreshRateValue.$error) {
        return;
      }
      this.updateRefreshRate(this.refreshRateValue);

      this.$notify({
        title: this.$t('$notify.titles.success'),
        text: this.$t('$notify.texts.aniListRefreshRateUpdated', { refreshRate: this.refreshRateValue }),
      });
    },
    loginToAniList() {
      if (!this.isAuthenticated) {
        ipcRenderer.send('aniList-oauth', 'getToken');
      }
    },
  },
  mounted() {
    this.refreshRateValue = this.refreshRate;
  },
  data() {
    return { refreshRateValue: 0 };
  },
  watch: {
    refreshRate(newValue) {
      this.refreshRateValue = newValue;
    },
  },
};
</script>

