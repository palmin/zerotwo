<template>
  <v-card v-if="item.streamingEpisodes.length">
    <v-card-title>{{ $t('detailView.streamingSubheader') }}</v-card-title>
    <v-slide-group show-arrows>
      <v-slide-item v-if="item.nextAiringEpisode && item.nextAiringEpisode.episode">
        <v-card class="ma-4" width="400">
          <v-container fill-height fluid>
            <v-layout fill-height wrap>
              <v-flex xs12>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="title shadowed text-wrap">{{ item.nextAiringEpisode.episodetitle }}</span>
                    <div class="subtitle shadowed">
                      {{ getReadableDateByTimestamp(item.nextAiringEpisode.airingAt) || $t('system.alerts.noInformation') }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12>
                <v-layout fill-height justify-start align-end>
                  <v-flex xs4>
                    <!-- <v-img v-if="episode.site === 'Crunchyroll'" height="50" class="background-shadowed" :src="require('@/assets/logos/Crunchyroll.svg')" /> -->
                    <span class="title shadowed">{{ episode.site }}</span>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-slide-item>

      <v-slide-item v-for="episode in item.streamingEpisodes" :key="episode.url">
        <v-card width="400" class="ma-4" @click="openInBrowser(episode.url)">
          <v-img :src="episode.thumbnail">
            <template v-slot:placeholder>
              <v-layout fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-layout>
            </template>
            <v-container fill-height fluid>
              <v-layout fill-height wrap>
                <v-flex xs12>
                  <v-layout fill-height>
                    <v-flex xs12>
                      <span class="title shadowed text-wrap">{{ episode.title }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12>
                  <v-layout fill-height justify-start align-end>
                    <v-flex xs4>
                      <!-- <v-img v-if="episode.site === 'Crunchyroll'" height="50" class="background-shadowed" :src="require('@/assets/logos/Crunchyroll.svg')" /> -->
                      <span class="title shadowed">{{ episode.site }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
        </v-card>
      </v-slide-item>
    </v-slide-group>
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

<style lang="scss" scoped>
.shadowed {
  color: #FFF;
  text-shadow:
    -1px 1px 4px #000,
    1px 1px 4px #000,
    1px -1px 4px #000,
    -1px -1px 4px #000,
    -2px 2px 4px #000,
    2px 2px 4px #000,
    2px -2px 4px #000,
    -2px -2px 4px #000;
}
.background-shadowed {
  filter:
    drop-shadow(-1px 1px 1px rgba(0,0,0,0.75))
    drop-shadow(1px -1px 1px rgba(0,0,0,0.75))
    drop-shadow(1px 1px 1px rgba(0,0,0,0.75))
    drop-shadow(-1px -1px 1px rgba(0,0,0,0.75))
  ;
}
</style>
