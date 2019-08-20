<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
          wrap
          fill-height
        >
          <v-flex xs12>
            <h2 class="display-3 text-center">
              {{ $t('system.settings.aboutZeroTwo.version') }}
            </h2>
            <h3 class="display-2 text-center">
              {{ currentAppVersion }}
            </h3>
          </v-flex>
          <v-flex
            xs2
          >
            <a
              href="#"
              class="headline"
              @click="openGitHub"
            >
              <v-img
                :src="require('@/assets/logos/github-logo.png')"
                alt="GitHub"
              />
            </a>
          </v-flex>
          <v-flex
            xs2
            offset-xs1
          >
            <a
              href="#"
              class="headline"
              @click="openDiscord"
            >
              <v-img
                :src="require('@/assets/logos/discord-blurple-logo.png')"
                alt="Discord"
              />
            </a>
          </v-flex>
          <v-flex
            xs2
            offset-xs1
          >
            <a
              href="#"
              class="headline"
              @click="openZeroTwo"
            >
              <v-img
                :src="require('@/assets/logos/ZeroTwoAppIcon_1024.png')"
                alt="ZeroTwo"
              />
            </a>
          </v-flex>
          <v-flex
            xs2
            offset-xs1
          >
            <a
              href="#"
              class="headline"
              @click="openAniList"
            >
              <v-img
                :src="require('@/assets/logos/AniListLogo.svg')"
                alt="AniList"
              />
            </a>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { shell } from 'electron';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { version } from '../../../package.json';

@Component
export default class AboutSettings extends Vue {
  @Prop(String)
  private tabKey!: string;

  private githubPage: URL = new URL('https://github.com/nicoaiko/zerotwo');

  private discordPage: URL = new URL('https://discord.gg/sTpR4Gw');

  private zeroTwoPage: URL = new URL('https://www.zerotwo.org');

  private aniListPage: URL = new URL('https://anilist.co');

  private get currentAppVersion(): string {
    return version;
  }

  private openGitHub() {
    shell.openExternal(this.githubPage.toString());
  }

  private openDiscord() {
    shell.openExternal(this.discordPage.toString());
  }

  private openZeroTwo() {
    shell.openExternal(this.zeroTwoPage.toString());
  }

  private openAniList() {
    shell.openExternal(this.aniListPage.toString());
  }
}
</script>
