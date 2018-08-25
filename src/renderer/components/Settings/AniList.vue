<template>
  <div class="ui basic tab segment" data-tab="aniList">
    <h2 class="ui header">
      {{ $t('system.settings.menu.aniList') }}
      <div class="sub header">
        {{ $t('system.settings.aniList.accountSettings') }}
      </div>
    </h2>
    <div class="ui container" v-if="!isAuthenticated">
      <button class="ui fluid primary button" @click="loginToAniList">{{ $t('system.actions.login') }}</button>
    </div>
    <div class="ui blue labels" v-else>
      <div class="ui label">
        {{ $t('system.settings.aniList.loggedInAs') }} {{ getUsername }}
      </div>
      <a class="ui label" @click="logMeOut">
        {{ $t('system.actions.logout') }}
      </a>
    </div>
    <div class="ui grid" v-if="isAuthenticated">
      <div class="eight wide column">
        <div class="ui form">
          <div class="required field" :class="{ error: $v.refreshRateValue.$error }">
            <label>{{ $t('system.settings.aniList.aniListRefreshRate') }}</label>
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
  </div>
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
      if (this.refreshRateEditMode) {
        if (this.$v.refreshRateValue.$error) {
          return;
        }
        this.updateRefreshRate(this.refreshRateValue);
      }

      this.refreshRateEditMode = !this.refreshRateEditMode;
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
  },
  mounted() {
    this.refreshRateValue = this.refreshRate;
  },
  data() {
    return {
      refreshRateValue: 0,
      refreshRateEditMode: false,
    };
  },
};
</script>

