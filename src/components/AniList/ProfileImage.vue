<template>
  <v-layout column fill-height d-flex align-center>
    <v-flex xs12>
      <v-avatar size="64">
        <img :src="avatarUrl" :alt="userName" />
      </v-avatar>
    </v-flex>
    <v-flex xs12>
      {{ userName }}
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { aniListStore } from '@/store';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ProfileImage extends Vue {
  private get avatarUrl(): string {
    return aniListStore.session.user.avatar.medium;
  }
  private get userName(): string {
    return aniListStore.session.user.name;
  }
}
</script>
