<template>
  <v-container fluid>
    <v-layout
      row
      wrap
    >
      <template v-for="(activity, index) in activities">
        <v-flex
          :key="activity.id"
          d-flex
          xs12
        >
          {{ activity.media.title.userPreferred }} {{ activity.status }} {{ activity.progress }}
        </v-flex>
        <v-divider
          v-if="index + 1 < activities.length"
          :key="`divider-${activity.id}`"
        />
      </template>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { IAniListActivity } from '@/modules/AniList/types';
import { aniListStore } from '@/store';

@Component
export default class Activities extends Vue {
  private get activities(): IAniListActivity[] {
    return aniListStore.latestActivities;
  }
}
</script>
