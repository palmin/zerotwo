<template>
  <v-tab-item key="myAnimeList">
    <v-card flat>
      <v-container fluid>
        <v-layout
          fill-height
          justify-center
          align-center>
          <v-btn color="primary" disabled>Deactivated!</v-btn>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
  <!-- <div class="ui basic tab segment" data-tab="myAnimeList">
    <h2 class="ui header">
      {{ $t('system.settings.menu.myAnimeList') }}
      <div class="sub header">
        {{ $t('system.settings.myAnimeList.accountSettings') }}
      </div>
    </h2>
    <form class="ui form" :ref="myAnimeListForm" v-if="!loggedIn" @submit.prevent="submit">
      <div class="two fields">
        <div class="field">
          <label>{{ $t('system.settings.myAnimeList.username') }}</label>
          <input type="text" v-model="username" />
        </div>
        <div class="field">
          <label>{{ $t('system.settings.myAnimeList.password') }}</label>
          <input type="password" v-model="password" />
        </div>
      </div>
      <button class="ui right floated primary button" type="submit">{{ $t('system.actions.login') }}</button>
    </form>
    <div class="ui blue labels" v-else>
      <div class="ui label">
        {{ $t('system.settings.myAnimeList.loggedInAs') }} {{ auth.username }}
      </div>
      <a class="ui label" @click="logMeOut">
        {{ $t('system.actions.logout') }}
      </a>
    </div>
    <div class="ui grid" v-if="this.auth">
      <div class="eight wide column">
        <div class="ui form">
          <div class="required field" :class="{ error: $v.refreshRateValue.$error }">
            <label>{{ $t('system.settings.myAnimeList.malRefreshRate') }}</label>
            <div class="ui action input">
              <input type="number" min="1" max="60" v-model="refreshRateValue" :disabled="!refreshRateEditMode" @input="$v.refreshRateValue.$touch()"
              />
              <button class="ui button" @click="editRefreshRate">
                {{ $t('system.actions.edit') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, between } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';

export default {
  mixins: [validationMixin],
  validations: {
    refreshRateValue: {
      required,
      between: between(1, 60),
    },
  },
  watch: {
    refreshRate(value) {
      this.refreshRateValue = value;
    },
  },
  computed: {
    ...mapState('myAnimeList', ['auth', 'refreshRate']),
    loggedIn() {
      return this.auth !== null;
    },
  },
  data() {
    return {
      username: '',
      password: '',
      myAnimeListForm: 'myAnimeListForm',
      refreshRateValue: 0,
      refreshRateEditMode: false,
    };
  },
  methods: {
    ...mapActions('myAnimeList', ['login', 'logout', 'setTimerRunning', 'updateRefreshRate']),
    logMeOut() {
      this.logout();
      this.close();
    },
    editRefreshRate() {
      if (this.refreshRateEditMode) {
        if (this.$v.refreshRateValue.$error) {
          return;
        }
        this.updateRefreshRate(this.refreshRateValue);
      }

      this.refreshRateEditMode = !this.refreshRateEditMode;
    },
    submit() {
      if (!this.username || !this.password) {
        this.$notify({
          type: 'err',
          title: this.$t('system.settings.myAnimeList.noCredentials'),
          text: this.$t('system.settings.myAnimeList.enterCredentials'),
        });

        return;
      }

      $(this.$refs[this.myAnimeListForm]).addClass('loading');
      this.login({ username: this.username, password: this.password })
        .then(() => this.setTimerRunning(true))
        .catch(() => {
          this.$notify({
            type: 'err',
            title: this.$t('system.settings.myAnimeList.credentialsWrongOrTooManyLoginAttempts'),
            text: this.$t('system.settings.myAnimeList.credentialsCouldNotBeVerifiedOrTooManyLoginAttempts'),
            duration: -1,
          });
          $(this.$refs[this.myAnimeListForm]).removeClass('loading');
        });
      this.username = this.password = '';
    },
  },
};
</script>
