<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ $t('settings') }}</div>
    <div class="content">
      <div class="ui grid">
        <div class="four wide column">
          <div class="ui fluid secondary vertical menu">
            <a class="active item" data-tab="appSettings">
              {{ $t('appSettings') }}
            </a>
            <a class="item" data-tab="myAnimeList">
              {{ $t('myAnimeList') }}
            </a>
            <a class="item" data-tab="restoreFactoryData">
              {{ $t('restoreFactoryData') }}
            </a>
            <a class="item" data-tab="aboutZeroTwo">
              {{ $t('aboutZeroTwo') }}
            </a>
          </div>
        </div>

        <div class="twelve wide column">
          <div class="ui active basic tab segment" data-tab="appSettings">
            <h2 class="ui header">
              {{ $t('setAppLanguage') }}
            </h2>
            <dropdown
              :items="languages"
              :placeholder="$t('chooseLanguage')"
              v-model="localeSetting"
              />
            <button class="ui primary button" @click="submitLanguageChange">{{ $t('changeLanguage') }}</button>
          </div>

          <div class="ui basic tab segment" data-tab="myAnimeList">
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

          <div class="ui basic tab segment" data-tab="aboutZeroTwo">
            <h2 class="ui center aligned header">
              {{ $t('aboutZeroTwo') }}
            </h2>
            <div class="ui equal width grid">
              <div class="center aligned sixteen wide column">
                <div class="ui huge statistic">
                  <div class="label">
                    {{ $t('version') }}
                  </div>
                  <div class="value">
                    {{ currentAppVersion }}
                  </div>
                </div>
              </div>

              <div class="center aligned column">
                <a href="#" class="ui huge icon header" @click="openPage(githubPage)">
                  <i class="github icon"></i>
                  <div class="content">
                    <img src="~/../assets/logos/github-logo.png" style="padding: 0 25px; margin-top: -14px;" class="ui medium image" alt="GitHub" />
                  </div>
                </a>
              </div>

              <div class="center aligned column">
                <a href="#" class="ui huge icon header" @click="openPage(discordPage)">
                  <i class="blurple discord icon"></i>
                  <div class="content">
                    <img src="~/../assets/logos/discord-blurple-logo.png" class="ui medium image" alt="Discord" />
                  </div>
                </a>
              </div>

              <div class="center aligned column">
                <a href="#" class="ui huge header" @click="openPage(zeroTwoPage)">
                  <div class="content">
                    <img src="~/../assets/logos/ZeroTwoAppIcon_1024.png" class="ui small image" title="ZeroTwo Website" alt="ZeroTwo Website" />
                  </div>
                </a>
              </div>
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

<style lang="scss" scoped>
.blurple {
  color: #7289DA
}
</style>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron';
import { mapState, mapActions, mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, between } from 'vuelidate/lib/validators';
import Dropdown from './Dropdown';

export default {
  mixins: [validationMixin],
  components: { Dropdown },
  props: ['event'],
  watch: {
    refreshRate(value) {
      this.refreshRateValue = value;
    },
  },
  computed: {
    ...mapState('myAnimeList', ['auth', 'refreshRate']),
    ...mapState('i18n', ['locale']),
    ...mapState(['currentAppVersion']),
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
      githubPage: 'https://github.com/nicoaiko/zerotwo',
      discordPage: 'https://discord.gg/sTpR4Gw',
      zeroTwoPage: 'https://www.zerotwo.org',
      username: '',
      password: '',
      myAnimeListForm: 'myAnimeListForm',
      refreshRateValue: 0,
      refreshRateEditMode: false,
      localeSetting: '',
      languages: [{
        name: 'English',
        value: 'en',
      }, {
        name: 'Deutsch',
        value: 'de',
      }, {
        name: '日本語',
        value: 'ja',
      }],
    };
  },
  mounted() {
    $('.ui.fluid.secondary.vertical.menu .item').tab();
    this.refreshRateValue = this.refreshRate;
  },
  methods: {
    ...mapActions('myAnimeList', ['login', 'logout', 'setTimerRunning', 'updateRefreshRate']),
    ...mapMutations('i18n', ['setLocale']),
    openPage(page) {
      if (page !== this.githubPage && page !== this.discordPage && page !== this.zeroTwoPage) {
        return;
      }

      shell.openExternal(page);
    },
    submitLanguageChange() {
      this.setLocale(this.localeSetting);
    },
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
          autofocus: false,
        })
        .modal('show');
      this.localeSetting = this.locale;
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
    "appSettings": "App Settings",
    "setAppLanguage": "Set app's language",
    "chooseLanguage": "Choose language",
    "changeLanguage": "Change language",
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
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>Your credentials are incorrect and could not be verified.</p><p>If you're sure that your credentials are correct, you might have had too many Login attempts!</p><p>If the latter applies to you, try again in one to six hours...</p>",
    "aboutZeroTwo": "About ZeroTwo",
    "version": "Version",
    "link": "Click Me"
  },
  "de": {
    "settings": "Einstellungen",
    "save": "Sichern",
    "edit": "Bearbeiten",
    "cancel": "Abbrechen",
    "close": "Schließen",
    "login": "Einloggen",
    "logout": "Ausloggen",
    "appSettings": "App-Einstellungen",
    "setAppLanguage": "Ändere App-Sprache",
    "chooseLanguage": "Sprache wählen",
    "changeLanguage": "Sprache ändern",
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
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>Deine Anmeldedaten sind inkorrekt und konnten demnach nicht verifiziert werden!</p><p>Wenn du dir bei deinen Anmeldedaten sicher bist, dann hattest du vielleicht zu viele Anmeldeversuche gehabt!</p><p>Wenn letzteres, dann versuche es in 1-6 Stunden erneut...</p>",
    "aboutZeroTwo": "Über ZeroTwo",
    "version": "Version",
    "link": "Klick mich"
  },
  "ja": {
    "settings": "設定",
    "save": "保存",
    "edit": "編集",
    "cancel": "キャンセル",
    "close": "クローズ",
    "login": "ログイン",
    "logout": "ログアウト",
    "appSettings": "アプリ設定",
    "setAppLanguage": "アプリ言語を編集",
    "chooseLanguage": "言語を選択する",
    "changeLanguage": "言語を設定する",
    "loggedInAs": "ログインしたアカウント",
    "myAnimeList": "MyAnimeList",
    "accountSettings": "アカウント設定",
    "username": "ユーザー名",
    "password": "パスワード",
    "restoreFactoryData": "ファクトリー設定に戻る",
    "refreshRate": "MALの更新間（分で）",
    "noCredentials": "ログインデータは入力しませんでした！",
    "enterCredentials": "ログインデータを入力してください！",
    "credentialsWrongOrTooManyLoginAttempts": "ログインデータは間違っています。もしくはログイン試し数は多いすぎます。",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>ログインデータは間違っていて、ログイン出来ませんでした。</p><p>ログインデータは間違っていない場合、ログイン試し数は多かったかもしれません。</p><p>ログインは短時間で試してください。</p>",
    "aboutZeroTwo": "ZeroTwoについて",
    "version": "バージョン",
    "link": "クリックして"
  }
}
</i18n>
