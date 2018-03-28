<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ $t('settings') }}</div>
    <div class="content">
      <div class="ui grid">
        <div class="four wide column">
          <div class="ui fluid secondary vertical menu">
            <a class="active item" data-tab="myAnimeList">
              {{ $t('myAnimeList') }}
            </a>
            <a class="item" data-tab="restoreFactoryData">
              {{ $t('restoreFactoryData') }}
            </a>
          </div>
        </div>

        <div class="twelve wide column">
          <div class="ui active basic tab segment" data-tab="myAnimeList">
            <h2 class="ui header">
              {{ $t('myAnimeList') }}
              <div class="sub header">
                {{ $t('accountSettings') }}
              </div>
            </h2>
            <form class="ui form" :ref="myAnimeListForm" v-if="!loggedIn" @submit.prevent="submit">
              <div class="two fields">
                <div class="field">
                  <label>{{ $t('username') }}</label>
                  <input type="text" v-model="username" />
                </div>
                <div class="field">
                  <label>{{ $t('password') }}</label>
                  <input type="password" v-model="password" />
                </div>
              </div>
              <button class="ui right floated primary button" type="submit">{{ $t('login') }}</button>
            </form>
            <div class="ui blue labels" v-else>
              <div class="ui label">
                {{ $t('loggedInAs') }} {{ auth.username }}
              </div>
              <a class="ui label" @click="logMeOut">
                {{ $t('logout') }}
              </a>
            </div>
            <div class="ui grid" v-if="this.auth">
              <div class="eight wide column">
                <div class="ui form">
                  <div class="required field" :class="{ error: $v.refreshRateValue.$error }">
                    <label>{{ $t('refreshRate') }}</label>
                    <div class="ui action input">
                      <input type="number" min="1" max="60" v-model="refreshRateValue" :disabled="!refreshRateEditMode" @input="$v.refreshRateValue.$touch()" />
                      <button class="ui button" @click="editRefreshRate">
                        {{ $t('edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="restoreFactoryData">
            <h2 class="ui header">
              {{ $t('restoreFactoryData') }}
            </h2>
            <div class="ui fluid primary button" @click="restoreFactoryData">
              {{ $t('restoreFactoryData') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui button" @click="close">{{ $t('close') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, between } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  props: ['event'],
  watch: {
    refreshRate(value) {
      this.refreshRateValue = value;
    },
  },
  computed: {
    ...mapState('myAnimeList', ['auth', 'refreshRate']),
    loggedIn() {
      return !!this.auth;
    },
  },
  validations: {
    refreshRateValue: {
      required,
      between: between(0, 60),
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
  mounted() {
    $('.ui.fluid.secondary.vertical.menu .item').tab();
    this.refreshRateValue = this.refreshRate;
  },
  methods: {
    ...mapActions('myAnimeList', ['login', 'logout', 'setTimerRunning', 'updateRefreshRate']),
    restoreFactoryData() {
      // Logout currently covers all essential data
      this.logout();
    },
    submit() {
      if (!this.username || !this.password) {
        this.$notify({
          type: 'error',
          title: this.$t('noCredentials'),
          text: this.$t('enterCredentials'),
        });

        return;
      }
      $(this.$refs[this.myAnimeListForm]).addClass('loading');
      this.login({ username: this.username, password: this.password })
        .then(() => this.setTimerRunning(true))
        .catch(() => {
          this.$notify({
            type: 'error',
            title: this.$t('credentialsWrongOrTooManyLoginAttempts'),
            text: this.$t('credentialsCouldNotBeVerifiedOrTooManyLoginAttempts'),
            duration: -1,
          });
          $(this.$refs[this.myAnimeListForm]).removeClass('loading');
        });
      this.username = this.password = '';
    },
    logMeOut() {
      this.logout();
      this.close();
    },
    close() {
      this.refreshRateValue = this.refreshRate;
      this.refreshRateEditMode = false;

      $(this.$el)
        .modal('hide');
    },
    show() {
      $(this.$el)
        .modal({
          closable: false,
          centered: false,
        })
        .modal('show');
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
  },
};
</script>

<i18n>
{
  "en": {
    "settings": "Settings",
    "save": "Save",
    "edit": "Edit",
    "cancel": "Cancel",
    "close": "Close",
    "login": "Login",
    "logout": "Logout",
    "loggedInAs": "Logged in as",
    "myAnimeList": "MyAnimeList",
    "accountSettings": "Account Settings",
    "username": "Username",
    "password": "Password",
    "restoreFactoryData": "Restore Factory Data",
    "refreshRate": "Refresh interval for MAL (in minutes)",
    "noCredentials": "No credentials!",
    "enterCredentials": "Please enter credentials to log in.",
    "credentialsWrongOrTooManyLoginAttempts": "Wrong credentials or Too many login attempts!",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>Your credentials are incorrect and could not be verified.</p><p>If you're sure that your credentials are correct, you might have had too many Login attempts!</p><p>If the latter applies to you, try again in one to six hours...</p>"
  },
  "de": {
    "settings": "Einstellungen",
    "save": "Sichern",
    "edit": "Bearbeiten",
    "cancel": "Abbrechen",
    "close": "Schließen",
    "login": "Einloggen",
    "logout": "Ausloggen",
    "loggedInAs": "Eingeloggt als",
    "myAnimeList": "MyAnimeList",
    "accountSettings": "Kontoeinstellungen",
    "username": "Benutzername",
    "password": "Passwort",
    "restoreFactoryData": "Werkszustand wiederherstellen",
    "refreshRate": "MAL-Aktualisierungsintervall (in Minuten)",
    "noCredentials": "Keine Anmeldedaten!",
    "enterCredentials": "Bitte gib Anmeldedaten ein, um dich einzuloggen.",
    "credentialsWrongOrTooManyLoginAttempts": "Anmeldedaten inkorrekt oder zu viele Anmeldeversuche!",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>Deine Anmeldedaten sind inkorrekt und konnten demnach nicht verifiziert werden!</p><p>Wenn du dir bei deinen Anmeldedaten sicher bist, dann hattest du vielleicht zu viele Anmeldeversuche gehabt!</p><p>Wenn letzteres, dann versuche es in 1-6 Stunden erneut...</p>"
  }
}
</i18n>
