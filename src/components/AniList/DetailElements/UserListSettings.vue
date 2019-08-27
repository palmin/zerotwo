<template>
  <v-card :loading="loading">
    <v-card-title primary-title>
      {{ $t('pages.aniList.detailView.ownInformation') }}
    </v-card-title>
    <v-card-text v-if="!item.listEntry">
      {{ $t('alerts.notYetInList') }}
    </v-card-text>

    <v-container grid-list-md fluid>
      <v-layout column>
        <v-flex>
          <v-select
            v-model="status"
            dense
            :items="listStatusses"
            :label="$t('pages.aniList.detailView.ownStatus')"
            :rules="[rules.required]"
            @change="checkStatus"
          />
        </v-flex>

        <v-flex>
          <v-text-field
            v-model="progress"
            :mask="getMask(item.episodes)"
            :suffix="`/ ${item.episodes}`"
            :label="$t('pages.aniList.detailView.ownProgress')"
            :rules="[rules.required]"
          />
        </v-flex>

        <v-flex>
          <v-text-field
            v-if="scoreSystem === POINT_100"
            v-model="score"
            suffix="/ 100"
            :label="$t('pages.aniList.detailView.ownScore')"
            :rules="[rules.required]"
          />

          <div v-if="scoreSystem !== POINT_100" class="text-center ma-auto">
            <div class="body-1 text-xs-left pl-1">
              {{ $t('pages.aniList.detailView.ownScore') }} ({{ score }})
            </div>
            <v-rating
              v-if="scoreSystem === POINT_10_DECIMAL"
              v-model="score"
              length="10"
              hover
              half-increments
            />

            <v-rating
              v-if="scoreSystem === POINT_10"
              v-model="score"
              length="10"
              hover
              dense
            />

            <v-rating
              v-if="scoreSystem === POINT_5"
              v-model="score"
              length="5"
              hover
              dense
            />

            <v-rating
              v-if="scoreSystem === POINT_3"
              v-model="score"
              length="3"
              hover
              dense
            />
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <v-card-actions v-if="item.listEntry">
      <v-layout>
        <v-flex>
          <v-btn text block color="success" @click="saveChanges">
            <v-icon left>
              mdi-content-save
            </v-icon>
            {{ $t('actions.save') }}
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn text block color="error" @click="removeFromList">
            <v-icon left>
              mdi-delete
            </v-icon>
            {{ $t('actions.remove') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>

    <v-card-actions v-else>
      <v-btn text color="success" block @click="addToList">
        <v-icon left>
          mdi-library-plus
        </v-icon>
        {{ $t('actions.add') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { isNumber } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import API from '@/modules/AniList/API';
import { AniListScoreFormat, AniListListStatus } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';

@Component
export default class UserListSettings extends Vue {
  @Prop()
  private item!: any;
  // @TODO: Give item a proper type

  private status: AniListListStatus = AniListListStatus.PLANNING;

  private progress: number = 0;

  private score: number = 0;

  private readonly POINT_100 = AniListScoreFormat.POINT_100;

  private readonly POINT_10_DECIMAL = AniListScoreFormat.POINT_10_DECIMAL;

  private readonly POINT_10 = AniListScoreFormat.POINT_10;

  private readonly POINT_5 = AniListScoreFormat.POINT_5;

  private readonly POINT_3 = AniListScoreFormat.POINT_3;

  private readonly listStatusses = [{
    text: this.$root.$t('misc.aniList.listStatusses.watching'),
    value: AniListListStatus.CURRENT,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.completed'),
    value: AniListListStatus.COMPLETED,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.dropped'),
    value: AniListListStatus.DROPPED,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.paused'),
    value: AniListListStatus.PAUSED,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.planning'),
    value: AniListListStatus.PLANNING,
  }, {
    text: this.$root.$t('misc.aniList.listStatusses.repeating'),
    value: AniListListStatus.REPEATING,
  }];

  private readonly rules = {
    required: (value: any) => !!value || this.$root.$t('misc.rules.required'),
  };

  private created() {
    if (this.item && this.item.listEntry) {
      this.score = this.item.listEntry.score;
      this.status = this.item.listEntry.status;
      this.progress = this.item.listEntry.progress;
    }
  }

  private get loading(): boolean {
    return appStore.isLoading;
  }

  private get scoreSystem(): AniListScoreFormat | null {
    if (!this.item) {
      return null;
    }

    const { scoreFormat } = aniListStore.session.user.mediaListOptions;

    return scoreFormat === AniListScoreFormat.POINT_3
      ? AniListScoreFormat.POINT_3
      : scoreFormat === AniListScoreFormat.POINT_5
        ? AniListScoreFormat.POINT_5
        : scoreFormat === AniListScoreFormat.POINT_10
          ? AniListScoreFormat.POINT_10
          : scoreFormat === AniListScoreFormat.POINT_10_DECIMAL
            ? AniListScoreFormat.POINT_10_DECIMAL
            : AniListScoreFormat.POINT_100;
  }

  private getMask(input: number | string): string | undefined {
    if (!isNumber(input)) {
      return '#####';
    }
    return '#'.repeat(input);
  }

  private checkStatus(status: AniListListStatus) {
    if (status === AniListListStatus.COMPLETED && typeof this.item.episodes === 'number') {
      this.progress = this.item.episodes;
    }
  }

  private async saveChanges(): Promise<void> {
    await appStore.setLoadingState(true);
    if (this.item && this.item.listEntry) {
      const { entryId } = this.item;
      const status = !this.status ? AniListListStatus.PLANNING : this.status;
      const score = !this.score ? 0 : this.score;
      const progress = !this.progress ? 0 : this.progress;

      try {
        const update = await API.updateEntry(entryId, progress, score, status);
        if (update) {
          if (status === AniListListStatus.COMPLETED) {
            this.$notify({
              title: this.$t('notifications.aniList.successTitle') as string,
              text: this.$t('notifications.aniList.completeUpdateText', [this.item.userPreferredTitle, this.progress]) as string,
            });
          } else {
            this.$notify({
              title: this.$t('notifications.aniList.successTitle') as string,
              text: this.$t('notifications.aniList.simpleUpdateText', [this.item.userPreferredTitle, this.progress]) as string,
            });
          }
          aniListStore.refreshLists();
          this.$emit('updated');
        }
      } catch (error) {
        this.$notify({
          title: this.$t('errors.updateFailed.title') as string,
          text: this.$t('errors.updateFailed.text') as string,
          type: 'error',
        });
      }
    }
    await appStore.setLoadingState(false);
  }

  private async removeFromList(): Promise<void> {
    if (!this.item || !this.item.listEntry) {
      return;
    }

    await appStore.setLoadingState(true);
    try {
      const { entryId } = this.item;

      if (await API.removeEntry(entryId)) {
        this.$notify({
          title: this.$t('notifications.aniList.successTitle') as string,
          text: this.$t('notifications.aniList.removeEntry', [this.item.userPreferredTitle]) as string,
        });
        this.$emit('updated');
      } else {
        throw new Error();
      }
    } catch (error) {
      this.$notify({
        title: this.$t('errors.updateFailed.title') as string,
        text: this.$t('errors.updateFailed.text') as string,
        type: 'error',
      });
    }
    await appStore.setLoadingState(false);
  }

  private async addToList(): Promise<void> {
    if (!this.item || this.item.listEntry) {
      this.$notify({
        title: 'FATAL ERROR (100)',
        text: 'addToList called with no media item or with existing list entry!',
        type: 'error',
      });

      return;
    }

    await appStore.setLoadingState(true);
    try {
      const { mediaId } = this.item;
      const status = !this.status ? AniListListStatus.PLANNING : this.status;
      const score = !this.score ? 0 : this.score;
      const progress = !this.progress ? 0 : this.progress;

      if (await API.addEntry(mediaId, status, score, progress)) {
        this.$notify({
          title: this.$t('notifications.aniList.successTitle') as string,
          text: this.$t('notifications.aniList.addedToList', [this.item.userPreferredTitle]) as string,
        });
        aniListStore.refreshLists();
        this.$emit('updated');
      } else {
        throw new Error();
      }
    } catch (error) {
      this.$notify({
        title: this.$t('errors.updateFailed.title') as string,
        text: this.$t('errors.updateFailed.text') as string,
        type: 'error',
      });
    }
    await appStore.setLoadingState(false);
  }
}
</script>
