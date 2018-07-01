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
            <a class="item" data-tab="myAnimeList" v-if="myAnimeListActivated">
              {{ $t('myAnimeList') }}
            </a>
            <a class="item" data-tab="aniList">
              {{ $t('aniList') }}
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
            <div class="ui grid">
              <div class="seven wide column">
                <div class="ui fluid selection dropdown">
                  <input type="hidden">
                  <i class="dropdown icon"></i>
                  <div class="default text">{{ $t('chooseLanguage') }}</div>
                  <div class="menu">
                    <div class="item" v-for="language in languages" :key="language.value" :data-value="language.value">
                      <span class="description">{{ language.englishName }}</span>
                      <span class="text">{{ language.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="four wide column">
                <button
                class="ui fluid primary button"
                @click="submitLanguageChange">
                  {{ $t('changeLanguage') }}
                </button>
              </div>
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="myAnimeList" v-if="myAnimeListActivated">
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
              <button
              class="ui right floated primary button"
              type="submit">{{ $t('login') }}</button>
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
                      <input
                      type="number"
                      min="1"
                      max="60"
                      v-model="refreshRateValue"
                      :disabled="!refreshRateEditMode"
                      @input="$v.refreshRateValue.$touch()" />
                      <button class="ui button" @click="editRefreshRate">
                        {{ $t('edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="aniList">
            <h2 class="ui header">
              {{ $t('aniList') }}
              <div class="sub header">
                {{ $t('accountSettings') }}
              </div>
            </h2>
            <div class="ui container" v-if="!isAuthenticated">
              <button
              class="ui fluid primary button"
              @click="loginToAniList">{{ $t('login') }}</button>
            </div>
            <div class="ui blue labels" v-else>
              <div class="ui label">
                {{ $t('loggedInAs') }} {{ getUserName }}
              </div>
              <a class="ui label" @click="logMeOut">
                {{ $t('logout') }}
              </a>
            </div>
            <div class="ui grid" v-if="isAuthenticated">
              <div class="eight wide column">
                <div class="ui form">
                  <div class="required field" :class="{ error: $v.refreshRateValue.$error }">
                    <label>{{ $t('aniListRefreshRate') }}</label>
                    <div class="ui action input">
                      <input
                      type="number"
                      min="1"
                      max="60"
                      v-model="refreshRateValue"
                      :disabled="!refreshRateEditMode"
                      @input="$v.refreshRateValue.$touch()" />
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
                    <img
                    src="~/../assets/logos/github-logo.png"
                    style="padding: 0 25px; margin-top: -14px;"
                    class="ui medium image"
                    alt="GitHub" />
                  </div>
                </a>
              </div>

              <div class="center aligned column">
                <a href="#" class="ui huge icon header" @click="openPage(discordPage)">
                  <i class="blurple discord icon"></i>
                  <div class="content">
                    <img
                    src="~/../assets/logos/discord-blurple-logo.png"
                    class="ui medium image"
                    alt="Discord" />
                  </div>
                </a>
              </div>

              <div class="center aligned column">
                <a href="#" class="ui huge header" @click="openPage(zeroTwoPage)">
                  <div class="content">
                    <img
                    src="~/../assets/logos/ZeroTwoAppIcon_1024.png"
                    class="ui small image"
                    title="ZeroTwo Website"
                    alt="ZeroTwo Website" />
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

<style lang="scss">
.b-tabs .tab-content,
.modal-card,
.modal-card-body {
    overflow: visible;
    width: 100%;
}
.modal .animation-content {
  width: 100%;
}
</style>


<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { shell, ipcRenderer } from 'electron';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, between } from 'vuelidate/lib/validators';
import find from 'lodash/find';

export default {
  mixins: [validationMixin],
  props: ['event'],
  watch: {
    refreshRate(value) {
      this.refreshRateValue = value;
    },
  },
  computed: {
    ...mapGetters('aniList', ['isAuthenticated', 'getUserName', 'refreshRate']),
    // ...mapState('myAnimeList', ['auth', 'refreshRate']),
    ...mapState('i18n', ['locale']),
    ...mapState(['currentAppVersion']),
  },
  validations: {
    refreshRateValue: {
      required,
      between: between(1, 60),
    },
  },
  data() {
    return {
      githubPage: 'https://github.com/nicoaiko/zerotwo',
      discordPage: 'https://discord.gg/sTpR4Gw',
      zeroTwoPage: 'https://www.zerotwo.org',
      myAnimeListActivated: false,
      username: '',
      password: '',
      myAnimeListForm: 'myAnimeListForm',
      refreshRateValue: 0,
      refreshRateEditMode: false,
      localeSetting: '',
      languages: [{
        name: 'English',
        englishName: 'English',
        value: 'en',
      }, {
        name: 'Deutsch',
        englishName: 'German',
        value: 'de',
      }, {
        name: '日本語',
        englishName: 'Japanese',
        value: 'ja',
      }, {
        name: '简体中文',
        englishName: 'Simplified Chinese',
        value: 'zh-cn',
      }],
    };
  },
  mounted() {
    $('.ui.fluid.secondary.vertical.menu .item').tab();
    this.refreshRateValue = this.refreshRate;
  },
  methods: {
    // ...mapActions('myAnimeList', ['login', 'logout', 'setTimerRunning', 'updateRefreshRate']),
    ...mapActions('aniList', ['logout', 'updateRefreshRate', 'setTimerRunning']),
    ...mapMutations('i18n', ['setLocale']),
    changeLanguageValue(value) {
      this.localeSetting = value;
    },
    getLanguageByCode(code) {
      const language = find(this.languages, language => language.value === code);

      if (language === undefined) {
        return 'ERROR';
      }

      return language.name;
    },
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
      // $(this.$refs[this.myAnimeListForm]).addClass('loading');
      // this.login({ username: this.username, password: this.password })
      //   .then(() => this.setTimerRunning(true))
      //   .catch(() => {
      //     this.$notify({
      //       type: 'error',
      //       title: this.$t('credentialsWrongOrTooManyLoginAttempts'),
      //       text: this.$t('credentialsCouldNotBeVerifiedOrTooManyLoginAttempts'),
      //       duration: -1,
      //     });
      //     $(this.$refs[this.myAnimeListForm]).removeClass('loading');
      //   });
      this.username = this.password = '';
    },
    loginToAniList() {
      if (!this.isAuthenticated) {
        ipcRenderer.send('aniList-oauth', 'getToken');
      }
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
      $('.ui.selection.dropdown', this.$el)
        .dropdown({
          onChange: this.changeLanguageValue,
        })
        .dropdown('set selected', this.locale);
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
    "aniList": "AniList",
    "accountSettings": "Account Settings",
    "loginData": "Login Data",
    "username": "Username",
    "password": "Password",
    "restoreFactoryData": "Restore Factory Data",
    "refreshRate": "Refresh interval for MAL (in minutes)",
    "aniListRefreshRate": "Refresh interval for AniList (in minutes)",
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
    "aniList": "AniList",
    "accountSettings": "Kontoeinstellungen",
    "loginData": "Logindaten",
    "username": "Benutzername",
    "password": "Passwort",
    "restoreFactoryData": "Werkszustand wiederherstellen",
    "refreshRate": "MAL-Aktualisierungsintervall (in Minuten)",
    "aniListRefreshRate": "AniList-Aktualisierungsintervall (in Minuten)",
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
    "aniList": "AniList",
    "accountSettings": "アカウント設定",
    "loginData": "ログインデータ",
    "username": "ユーザー名",
    "password": "パスワード",
    "restoreFactoryData": "ファクトリー設定に戻る",
    "refreshRate": "MALの更新間（分で）",
    "aniListRefreshRate": "AniListの更新間（分で）",
    "noCredentials": "ログインデータは入力しませんでした！",
    "enterCredentials": "ログインデータを入力してください！",
    "credentialsWrongOrTooManyLoginAttempts": "ログインデータは間違っています。もしくはログイン試し数は多いすぎます。",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>ログインデータは間違っていて、ログイン出来ませんでした。</p><p>ログインデータは間違っていない場合、ログイン試し数は多かったかもしれません。</p><p>ログインは短時間で試してください。</p>",
    "aboutZeroTwo": "ZeroTwoについて",
    "version": "バージョン",
    "link": "クリックして"
  },
  "zh-cn": {
    "settings": "设置",
    "save": "保存",
    "edit": "编辑",
    "cancel": "取消",
    "close": "关闭",
    "login": "登录",
    "logout": "登出",
    "appSettings": "软件设置",
    "setAppLanguage": "设置软件语言",
    "chooseLanguage": "选择语言",
    "changeLanguage": "更改语言",
    "loggedInAs": "登录为",
    "myAnimeList": "MyAnimeList",
    "aniList": "AniList",
    "accountSettings": "账户设置",
    "loginData": "登录数据",
    "username": "用户名",
    "password": "密码",
    "restoreFactoryData": "恢复出厂数据",
    "refreshRate": "MAL刷新间隔（分钟）",
    "aniListRefreshRate": "AniList刷新间隔（分钟）",
    "noCredentials": "没有登录信息！",
    "enterCredentials": "请输入登录信息以用于登录。",
    "credentialsWrongOrTooManyLoginAttempts": "登录信息错误或登录尝试次数过多！",
    "credentialsCouldNotBeVerifiedOrTooManyLoginAttempts": "<p>你的登录信息有误，无法通过验证。</p><p>如果你确定你的登录信息准确无误，那么可能是因为你进行了过多次的登录尝试！</p><p>如果你遇到的情况属于后者，请等1~6个小时后再进行尝试……</p>",
    "aboutZeroTwo": "关于ZeroTwo",
    "version": "版本号",
    "link": "点击我"
  }
}
</i18n>
