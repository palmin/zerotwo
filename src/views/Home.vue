<template>
  <v-content>
    <v-card>
      <v-card-text class="background" :style="`background-image: url(${currentUser.bannerImage})`">
        <v-container fluid>
          <v-flex xs2>
            <ProfileImage />
          </v-flex>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-text>
        <v-container fluid fill-height>
          <v-flex xs6>
            <span class="subheader">{{ $t('') }}</span>
          </v-flex>
        </v-container>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import ProfileImage from '@/components/AniList/ProfileImage.vue';
import { Component, Vue } from 'vue-property-decorator';
import { aniListStore } from '../store';

@Component({
  components: {
    ProfileImage,
  },
})
export default class Home extends Vue {
  private get currentUser() {
    return aniListStore.session.user;
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-size: cover;
}
</style>

