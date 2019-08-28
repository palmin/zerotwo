<template>
  <v-content>
    <v-card v-if="isAuthenticated">
      <v-card-text class="background" :style="`background-image: url(${currentUser.bannerImage})`">
        <v-container fluid>
          <v-layout>
            <v-flex xs2>
              <ProfileImage />
            </v-flex>

            <v-flex xs2 offset-xs8>
              <v-img
                class="pointer-on-hover"
                :src="require('@/assets/logos/Ko-fi-Support-Button.png')"
                @click="openSupportPage"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card v-if="isAuthenticated">
      <v-card-text>
        <v-container fluid fill-height>
          <v-flex xs12>
            <div class="title">
              {{ $t('pages.aniList.home.activities.headline') }}
            </div>
            <Activities />
          </v-flex>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card v-if="!isAuthenticated">
      <v-card-title primary-title>
        <div>
          <div class="headline">
            {{ $t('alerts.unauthenticated') }}
          </div>
          <span class="subheading">{{ $t('pages.aniList.home.howToAuthenticate.header') }}</span>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="body-2">
          <p v-for="(item, index) in $t('pages.aniList.home.howToAuthenticate.text')" :key="index">
            {{ item }}
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import { shell } from 'electron';
import { Component, Vue } from 'vue-property-decorator';
import Activities from '@/components/AniList/Activities.vue';
import ProfileImage from '@/components/AniList/ProfileImage.vue';
import { aniListStore } from '@/store';

@Component({
  components: {
    Activities,
    ProfileImage,
  },
})
export default class Home extends Vue {
  private get currentUser() {
    return aniListStore.session.user;
  }

  private get isAuthenticated(): boolean {
    return aniListStore.isAuthenticated;
  }

  private openSupportPage(): void {
    shell.openExternal('https://ko-fi.com/nicoaiko');
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-size: cover;
}
.pointer-on-hover:hover {
  cursor: pointer;
}
</style>
