<template>
  <v-content>
    <v-card v-if="isAuthenticated">
      <v-card-text class="background" :style="`background-image: url(${currentUser.bannerImage})`">
        <v-container fluid>
          <v-flex xs2>
            <ProfileImage />
          </v-flex>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card v-if="isAuthenticated">
      <v-card-text>
        <v-container fluid fill-height>
          <v-flex xs6>
            <div class="title">{{ $t('system.aniList.activities') }}</div>
            <Activities />
          </v-flex>
        </v-container>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import Activities from '@/components/AniList/Activities.vue';
import ProfileImage from '@/components/AniList/ProfileImage.vue';
import { Component, Vue } from 'vue-property-decorator';
import { aniListStore } from '../store';

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
}
</script>

<style lang="scss" scoped>
.background {
  background-size: cover;
}
</style>

