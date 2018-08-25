<template>
  <div class="ui basic tab segment" data-tab="aboutZeroTwo">
    <h2 class="ui center aligned header">
      {{ $t('system.settings.menu.aboutZeroTwo') }}
    </h2>
    <div class="ui equal width grid">
      <div class="center aligned sixteen wide column">
        <div class="ui huge statistic">
          <div class="label">
            {{ $t('system.settings.aboutZeroTwo.version') }}
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
            src="~@/assets/logos/github-logo.png"
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
            src="~@/assets/logos/discord-blurple-logo.png"
            class="ui medium image"
            alt="Discord" />
          </div>
        </a>
      </div>

      <div class="center aligned column">
        <a href="#" class="ui huge header" @click="openPage(zeroTwoPage)">
          <div class="content">
            <img
            src="~@/assets/logos/ZeroTwoAppIcon_1024.png"
            class="ui small image"
            title="ZeroTwo Website"
            alt="ZeroTwo Website" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron';
import { mapState } from 'vuex';

export default {
  computed: { ...mapState(['currentAppVersion']) },
  data() {
    return {
      githubPage: 'https://github.com/nicoaiko/zerotwo',
      discordPage: 'https://discord.gg/sTpR4Gw',
      zeroTwoPage: 'https://www.zerotwo.org',
    };
  },
  methods: {
    openPage(page) {
      if (page !== this.githubPage && page !== this.discordPage && page !== this.zeroTwoPage) {
        return;
      }

      shell.openExternal(page);
    },
  },
};
</script>

<style lang="scss" scoped>
.blurple {
  color: #7289DA
}
</style>
