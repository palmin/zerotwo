<template>
  <v-content>
    <v-card v-if="isAuthenticated">
      <v-card-text class="background" :style="`background-image: url(${currentUser.bannerImage})`">
        <v-container fluid>
          <v-layout>
            <v-flex
              xs8
              sm6
              md4
              lg3
              xl2
            >
              <ProfileImage />
            </v-flex>

            <v-flex
              xs4
              sm3
              md3
              lg3
              xl3
              offset-xs0
              offset-sm2
              offset-md5
              offset-lg6
              offset-xl7
            >
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
  private async beforeMount() {
    if ('login' in this.$route.query) {
      const { access_token: accessToken } = this.$route.query;

      if (!accessToken) {
        this.$router.replace({ name: 'Home' });
      }

      await aniListStore.setSession(accessToken as string);
      this.$router.replace({ name: 'Home' });
    }
  }

  private get currentUser() {
    return aniListStore.session.user;
  }

  private get isAuthenticated(): boolean {
    return aniListStore.isAuthenticated;
  }

  private openSupportPage(): void {
    window.open('https://ko-fi.com/nicoaiko', '_blank');
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
