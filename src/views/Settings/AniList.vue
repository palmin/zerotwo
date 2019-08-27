<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-container fluid fill-height grid-list-xl>
        <v-layout
          v-if="!isAuthenticated"
          class="ma-4"
          fill-height
          justify-center
          align-center
        >
          <v-btn color="primary" @click="loginToAniList">
            {{ $t('actions.login') }}
          </v-btn>
        </v-layout>
        <v-layout v-else fill-height justify-center align-center>
          <v-flex xs5 text-center>
            <v-layout column>
              <v-flex>
                {{ $t('pages.settings.aniList.loggedInAs', [currentUser.name]) }}
              </v-flex>
              <v-flex>
                <v-btn color="red darken-2" @click="logout">
                  {{ $t('actions.logout') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs5 offset-xs2>
            <v-text-field
              v-model="currentAniListRefreshRate"
              type="number"
              :min="5"
              :label="$t('pages.settings.aniList.refreshRate')"
              :suffix="$t('pages.settings.aniList.refreshRateSuffix')"
              :hint="$t('pages.settings.aniList.refreshRateHint')"
              persistent-hint
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { map } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { aniListStore, appStore } from '@/store';
import { IAniListUser } from '@/modules/AniList/types';

@Component
export default class AniListSettings extends Vue {
  @Prop(String)
  private tabKey!: string;

  private get isAuthenticated(): boolean {
    return aniListStore && aniListStore.isAuthenticated;
  }

  private get currentUser(): IAniListUser {
    return aniListStore.session.user;
  }

  private get currentAniListRefreshRate(): number {
    return aniListStore.refreshRate;
  }

  private set currentAniListRefreshRate(refreshRate: number) {
    aniListStore.setRefreshRate(refreshRate);
  }

  private loginToAniList() {
    if (!aniListStore.isAuthenticated) {
      ipcRenderer.send('aniListOAuth', 'getToken');
    }
  }

  private async logout() {
    if (!aniListStore.isAuthenticated) {
      return;
    }

    await appStore.setLoadingState(true);

    await aniListStore.logout();

    await appStore.setLoadingState(false);

    this.$router.push({ name: 'Home' });
  }
}
</script>
