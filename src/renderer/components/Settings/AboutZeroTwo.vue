<template>
  <v-tab-item key="appSettings">
    <v-card flat>
      <v-container fluid>
        <v-layout align-center justify-center row wrap>
          <v-flex xs12>
            <h2 class="display-3 text-xs-center">{{ $t('system.settings.aboutZeroTwo.version') }}</h2>
            <h3 class="display-2 text-xs-center">{{ currentAppVersion }}</h3>
          </v-flex>
          <v-flex xs4>
            <a href="#" class="headline" @click="openPage(githubPage)">
              <v-img :src="githubLogo" alt="GitHub" />
            </a>
          </v-flex>
          <v-flex xs4>
            <a href="#" class="headline" @click="openPage(discordPage)">
              <v-img :src="discordLogo" alt="Discord" />
            </a>
          </v-flex>
          <v-flex xs4>
            <a href="#" class="headline" @click="openPage(zeroTwoPage)">
              <v-img :src="zeroTwoLogo" alt="ZeroTwo" />
            </a>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron';
import { mapState } from 'vuex';

import githubLogo from '@/assets/logos/github-logo.png';
import discordLogo from '@/assets/logos/discord-blurple-logo.png';
import zeroTwoLogo from '@/assets/logos/ZeroTwoAppIcon_1024.png';

export default {
  computed: { ...mapState(['currentAppVersion']) },
  data() {
    return {
      githubPage: 'https://github.com/nicoaiko/zerotwo',
      discordPage: 'https://discord.gg/sTpR4Gw',
      zeroTwoPage: 'https://www.zerotwo.org',

      githubLogo,
      discordLogo,
      zeroTwoLogo,
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
