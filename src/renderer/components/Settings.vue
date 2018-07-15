<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ $t('system.settings.title') }}</div>
    <div class="content">
      <div class="ui grid">
        <div class="four wide column">
          <div class="ui fluid secondary vertical menu">
            <a class="active item" data-tab="appSettings">
              {{ $t('system.settings.appSettings') }}
            </a>
            <a class="item" data-tab="myAnimeList" v-if="myAnimeListActivated">
              {{ $t('system.settings.myAnimeList') }}
            </a>
            <a class="item" data-tab="aniList">
              {{ $t('system.modules.aniList') }}
            </a>
            <a class="item" data-tab="restoreFactoryData">
              {{ $t('system.settings.restoreFactoryData') }}
            </a>
            <a class="item" data-tab="aboutZeroTwo">
              {{ $t('system.settings.aboutZeroTwo') }}
            </a>
          </div>
        </div>

        <div class="twelve wide column">
          <div class="ui active basic tab segment" data-tab="appSettings">
            <h2 class="ui header">
              {{ $t('system.settings.setAppLanguage') }}
            </h2>
            <div class="ui grid">
              <div class="seven wide column">
                <div class="ui fluid selection dropdown">
                  <input type="hidden">
                  <i class="dropdown icon"></i>
                  <div class="default text">{{ $t('system.settings.chooseLanguage') }}</div>
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
                  {{ $t('system.settings.changeLanguage') }}
                </button>
              </div>
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="myAnimeList" v-if="myAnimeListActivated">
            <h2 class="ui header">
              {{ $t('system.settings.myAnimeList') }}
              <div class="sub header">
                {{ $t('system.settings.accountSettings') }}
              </div>
            </h2>
            <form class="ui form" :ref="myAnimeListForm" v-if="!loggedIn" @submit.prevent="submit">
              <div class="two fields">
                <div class="field">
                  <label>{{ $t('system.settings.username') }}</label>
                  <input type="text" v-model="username" />
                </div>
                <div class="field">
                  <label>{{ $t('system.settings.password') }}</label>
                  <input type="password" v-model="password" />
                </div>
              </div>
              <button
              class="ui right floated primary button"
              type="submit">{{ $t('system.actions.login') }}</button>
            </form>
            <div class="ui blue labels" v-else>
              <div class="ui label">
                {{ $t('system.settings.loggedInAs') }} {{ auth.username }}
              </div>
              <a class="ui label" @click="logMeOut">
                {{ $t('system.actions.logout') }}
              </a>
            </div>
            <div class="ui grid" v-if="this.auth">
              <div class="eight wide column">
                <div class="ui form">
                  <div class="required field" :class="{ error: $v.refreshRateValue.$error }">
                    <label>{{ $t('system.settings.malRefreshRate') }}</label>
                    <div class="ui action input">
                      <input
                      type="number"
                      min="1"
                      max="60"
                      v-model="refreshRateValue"
                      :disabled="!refreshRateEditMode"
                      @input="$v.refreshRateValue.$touch()" />
                      <button class="ui button" @click="editRefreshRate">
                        {{ $t('system.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="aniList">
            <h2 class="ui header">
              {{ $t('system.modules.aniList') }}
              <div class="sub header">
                {{ $t('system.settings.accountSettings') }}
              </div>
            </h2>
            <div class="ui container" v-if="!isAuthenticated">
              <button
              class="ui fluid primary button"
              @click="loginToAniList">{{ $t('system.actions.login') }}</button>
            </div>
            <div class="ui blue labels" v-else>
              <div class="ui label">
                {{ $t('system.settings.loggedInAs') }} {{ getUserName }}
              </div>
              <a class="ui label" @click="logMeOut">
                {{ $t('system.actions.logout') }}
              </a>
            </div>
            <div class="ui grid" v-if="isAuthenticated">
              <div class="eight wide column">
                <div class="ui form">
                  <div class="required field" :class="{ error: $v.refreshRateValue.$error }">
                    <label>{{ $t('system.settings.aniListRefreshRate') }}</label>
                    <div class="ui action input">
                      <input
                      type="number"
                      min="1"
                      max="60"
                      v-model="refreshRateValue"
                      :disabled="!refreshRateEditMode"
                      @input="$v.refreshRateValue.$touch()" />
                      <button class="ui button" @click="editRefreshRate">
                        {{ $t('system.actions.edit') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="restoreFactoryData">
            <h2 class="ui header">
              {{ $t('system.settings.restoreFactoryData') }}
            </h2>
            <div class="ui fluid primary button" @click="restoreFactoryData">
              {{ $t('system.settings.restoreFactoryData') }}
            </div>
          </div>

          <div class="ui basic tab segment" data-tab="aboutZeroTwo">
            <h2 class="ui center aligned header">
              {{ $t('system.settings.aboutZeroTwo') }}
            </h2>
            <div class="ui equal width grid">
              <div class="center aligned sixteen wide column">
                <div class="ui huge statistic">
                  <div class="label">
                    {{ $t('system.settings.version') }}
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
      <div class="ui button" @click="close">{{ $t('system.actions.close') }}</div>
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
