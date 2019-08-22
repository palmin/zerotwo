<template>
  <v-card>
    <v-list>
      <v-list-group v-model="streamingEpisodesExpanded">
        <template v-slot:activator>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ $t('detailView.streamingSubheader') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-list-item v-for="episode in item.streamingEpisodes" :key="episode.url">
          <v-list-item-content>
            <v-list-item-title>{{ episode.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ episode.site }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon color="yellow" @click="openInBrowser(episode.url)">
              mdi-open-in-new
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list-group>

      <v-list-item v-if="item.nextAiringEpisode && item.nextAiringEpisode.episode">
        <v-list-item-content>
          <v-list-item-title>{{ item.nextAiringEpisode.episode }}</v-list-item-title>
          <v-list-item-subtitle>{{ getReadableDateByTimestamp(item.nextAiringEpisode.airingAt) || $t('system.alerts.noInformation') }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon color="yellow" @click="openInBrowser(episode.url)">
            mdi-open-in-new
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { shell } from 'electron';
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StreamingService extends Vue {
  @Prop()
  private item!: any;

  private streamingEpisodesExpanded: boolean = false;

  private openInBrowser(link: string) {
    shell.openExternal(link);
  }

  private getReadableDateByTimestamp(timestamp?: number): string | null {
    if (!timestamp) {
      return null;
    }

    const format = this.$t('system.dates.full') as string;

    const formattedMoment = moment(timestamp, 'X');
    if (!formattedMoment.isValid()) {
      return null;
    }

    return formattedMoment.format(format);
  }
}
</script>
