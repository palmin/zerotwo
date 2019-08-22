<template>
  <v-layout column fill-height d-flex align-center>
    <v-flex xs12>
      <v-avatar size="128" tile>
        <v-img :src="avatarUrl" :alt="userName">
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-layout>
          </template>
        </v-img>
      </v-avatar>
    </v-flex>
    <v-flex xs12>
      <span class="headline shadowed">{{ userName }}</span>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { aniListStore, appStore } from '@/store';

@Component
export default class ProfileImage extends Vue {
  private get avatarUrl(): string {
    return aniListStore.session.user.avatar.large;
  }

  private get userName(): string {
    return aniListStore.session.user.name;
  }

  private get isDarkMode(): boolean {
    return appStore.darkMode;
  }
}
</script>

<style lang="scss" scoped>
.shadowed {
  color: #FFF;
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}
</style>
