<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap>
      <v-flex
        v-for="activity in activities"
        :key="activity.id"
        xs12
        sm6
        md4
        lg3
        xl2
      >
        <v-card>
          <ListImage :image-link="activity.coverImage" :ani-list-id="activity.mediaId" name="" />

          <v-card-text>
            <template v-if="activity.completed">
              {{ $t('pages.aniList.home.activities.completed', [activity.title]) }}
            </template>
            <template v-else-if="activity.plansToWatch">
              {{ $t('pages.aniList.home.activities.plansToWatch', [activity.title]) }}
            </template>
            <template v-else-if="activity.watchedEpisode">
              {{ $t('pages.aniList.home.activities.watchedEpisode', [activity.title, activity.progress]) }}
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import { IAniListActivity } from '@/modules/AniList/types';
import { aniListStore } from '@/store';

@Component({ components: { ListImage } })
export default class Activities extends Vue {
  private get activities() {
    return aniListStore.latestActivities.map(activity => ({
      mediaId: activity.media.id,
      title: activity.media.title.userPreferred,
      progress: activity.progress,
      createdAt: moment(activity.createdAt).fromNow(),
      coverImage: activity.media.coverImage.extraLarge,
      // Status
      watchedEpisode: activity.status === 'watched episode',
      completed: activity.status === 'completed',
      plansToWatch: activity.status === 'plans to watch',
    }));
  }
}
</script>
