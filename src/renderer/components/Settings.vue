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
              <button class="ui primary button" type="submit">{{ $t('login') }}</button>
            </form>
            <div class="ui blue labels" v-else>
              <div class="ui label">
                {{ $t('loggedInAs') }} {{ auth.username }}
              </div>
              <a class="ui label" @click="logout">
                {{ $t('logout') }}
              </a>
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

export default {
  props: ['event'],
  computed: {
    ...mapState('myAnimeList', ['auth']),
    loggedIn() {
      return !!this.auth;
    },
  },
  data() {
    return {
      username: '',
      password: '',
      myAnimeListForm: 'myAnimeListForm',
    };
  },
  mounted() {
    $('.ui.fluid.secondary.vertical.menu .item').tab();
  },
  methods: {
    ...mapActions('myAnimeList', ['login', 'logout', 'detectAndSetMALData']),
    restoreFactoryData() {
      // Logout currently covers all essential data
      this.logout();
    },
    submit() {
      $(this.$refs[this.myAnimeListForm]).addClass('loading');
      this.login({ username: this.username, password: this.password })
        .then(() => this.detectAndSetMALData());
      this.username = this.password = '';
    },
    close() {
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
  },
};
</script>

<i18n>
{
  "en": {
    "settings": "Settings",
    "save": "Save",
    "cancel": "Cancel",
    "close": "Close",
    "login": "Login",
    "logout": "Logout",
    "loggedInAs": "Logged in as",
    "myAnimeList": "MyAnimeList",
    "accountSettings": "Account Settings",
    "username": "Username",
    "password": "Password",
    "restoreFactoryData": "Restore Factory Data"
  },
  "de": {
    "settings": "Einstellungen",
    "save": "Sichern",
    "cancel": "Abbrechen",
    "close": "Schließen",
    "login": "Einloggen",
    "logout": "Ausloggen",
    "loggedInAs": "Eingeloggt als",
    "myAnimeList": "MyAnimeList",
    "accountSettings": "Kontoeinstellungen",
    "username": "Benutzername",
    "password": "Passwort",
    "restoreFactoryData": "Werkszustand wiederherstellen"
  }
}
</i18n>
