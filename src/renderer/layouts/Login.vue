<template>
  <div class="ui container">
    <div class="ui dimmer" :class="{ active: !isReady }">
      <div class="ui text loader">
        {{ $t('loading') }}
      </div>
    </div>
    <h2 class="ui header">{{ $t('loginToMAL') }}</h2>
    <form @submit.prevent="submit" class="ui form">
      <div class="two fields">
        <div class="required field">
          <label>{{ $t('username') }}</label>
          <input type="text" v-model="username" />
        </div>
        <div class="required field">
          <label>{{ $t('password') }}</label>
          <input type="password" v-model="password" />
        </div>
      </div>
      <button class="ui primary button" type="submit">{{ $t('login') }}</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['isReady']),
  },
  methods: {
    ...mapMutations(['setReady']),
    ...mapActions('myAnimeList', ['login', 'setTimerRunning']),
    async submit() {
      await this.setReady(false);
      try {
        await this.login({ username: this.username, password: this.password });
      } catch (error) {
        this.$notify({
          type: 'error',
          title: this.$t('credentialsCouldNotBeVerified'),
          text: error,
        });
      }
      await this.setTimerRunning(true);
      await this.setReady(true);
    },
  },
  name: 'app',
  data() {
    return {
      username: '',
      password: '',
    };
  },
};
</script>

<i18n>
{
  "en": {
    "loading": "Loading...",
    "loginToMAL": "Login to MyAnimeList",
    "username": "Username",
    "password": "Password",
    "login": "Login",
    "credentialsCouldNotBeVerified": "Your credentials are incorrect and could not be verified."
  },
  "de": {
    "loading": "Lädt...",
    "loginToMAL": "Einloggen zu MyAnimeList",
    "username": "Benutzername",
    "password": "Passwort",
    "login": "Einloggen",
    "credentialsCouldNotBeVerified": "Ihre Anmeldedaten sind inkorrekt und konnten demnach nicht verifiziert werden!"
  }
}
</i18n>

<style scoped>
.ui.dimmer {
  position: fixed !important;
}
</style>


<style>
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity .25s;
}

.fade-leave-active {
  transition: opacity .25s;
  opacity: 0;
}
</style>
