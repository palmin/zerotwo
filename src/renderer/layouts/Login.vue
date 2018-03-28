<template>
  <div class="ui container">
    <div class="ui dimmer" :class="{ active: !isReady }">
      <div class="ui text loader">
        {{ $t('loading') }}
      </div>
    </div>
    <h1 class="ui header">
      {{ $t('ZeroTwo') }}
    </h1>
    <p>{{ $t('contentOne') }}</p>
    <p>{{ $t('contentTwo') }}</p>
    <p>{{ $t('contentThree') }}</p>
    <p>{{ $t('contentFour') }}</p>
    <div class="ui divider"></div>
    <div class="ui container">
      <h3 class="ui header">{{ $t('loginToMAL') }}</h3>
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
    submit() {
      this.setReady(false);
      this.login({ username: this.username, password: this.password })
        .then(() => {
          this.setTimerRunning(true);
        })
        .catch(() => {
          this.$notify({
            type: 'error',
            title: this.$t('credentialsWrongOrTooManyLoginAttempts'),
            text: this.$t('credentialsCouldNotBeVerifiedOrTooManyLoginAttempts'),
            duration: -1,
          });
        });
      this.setReady(true);
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
    "ZeroTwo": "ZeroTwo",
    "contentOne": "Welcome to ZeroTwo, the whole new experience of managing the MyAnimeList!",
    "contentTwo": "With this program you will easily add, update or delete Anime from your list!",
    "contentThree": "Also, if you use Torrents, you can set up an RSS Feed to search for the latest updates of your favourite Anime releases!",
    "contentFour": "You only have to login to MyAnimeList and the fun can begin!",
    "loading": "Loading...",
    "loginToMAL": "Login to MyAnimeList",
    "username": "Username",
    "password": "Password",
    "login": "Login",
    "credentialsWrongOrTooManyLoginAttempts": "Wrong credentials or Too many login attempts!",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>Your credentials are incorrect and could not be verified.</p><p>If you're sure that your credentials are correct, you might have had too many Login attempts!</p><p>If the latter applies to you, try again in one to six hours...</p>"
  },
  "de": {
    "ZeroTwo": "ZeroTwo",
    "contentOne": "Willkommen und danke, dass du ZeroTwo nutzt, die ganz neue Erfahrung, deine MyAnimeList zu managen!",
    "contentTwo": "Mithilfe dieses Programms kannst du ganz leicht Anime deiner Liste hinzufügen, sie aktualisieren oder löschen!",
    "contentThree": "Wenn du darüberhinaus auch noch Torrents nutzt, kannst du einen RSS-Feed einstellen, der dir die aktuellsten Releases deiner Favoriten raussucht!",
    "contentFour": "Du musst nur eines tun: Dich bei MyAnimeList einloggen!",
    "loading": "Lädt...",
    "loginToMAL": "Einloggen bei MyAnimeList",
    "username": "Benutzername",
    "password": "Passwort",
    "login": "Einloggen",
    "credentialsWrongOrTooManyLoginAttempts": "Anmeldedaten inkorrekt oder zu viele Anmeldeversuche!",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>Deine Anmeldedaten sind inkorrekt und konnten demnach nicht verifiziert werden!</p><p>Wenn du dir bei deinen Anmeldedaten sicher bist, dann hattest du vielleicht zu viele Anmeldeversuche gehabt!</p><p>Wenn letzteres, dann versuche es in 1-6 Stunden erneut...</p>"
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
