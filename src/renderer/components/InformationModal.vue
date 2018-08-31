<template>
  <v-dialog
    v-model="dialog"
    scrollable
    lazy
    :overlay="false"
    transition="fade-transition"
  >
    <v-card dark>
      <v-toolbar>
        <v-btn icon dark @click.native="close">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
        <v-toolbar-title>{{ header }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
          <v-layout class="ma-2">
            <v-flex xs3>
              <v-img
                :src="image"
                :alt="header"
                class="ma-4 grey lighten-2"
              >
                <v-layout
                  slot="placeholder"
                  fill-height
                  align-center
                  justify-center
                  ma-0>
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </v-img>
            </v-flex>

            <v-flex xs4>
              <h2 class="headline mb-0">{{ $t('system.informationModal.seriesInformation') }}</h2>
              <v-list>
                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.episodes') }}: {{ episodes }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.rating') }}: {{ rating }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.type') }}: {{ type }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.synonyms') }}: {{ synonyms }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.englishName') }}: {{ englishName }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.japaneseName') }}: {{ japaneseName }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.airingTime') }}: {{ airingTime }}
                  </v-list-tile-content>
                </v-list-tile>

                <v-divider></v-divider>

                <v-list-tile>
                  <v-list-tile-content>
                    {{ $t('system.informationModal.seriesStatus') }}: {{ seriesStatus }}
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-flex>

            <v-flex xs4 offset-xs1>
              <h2 class="headline mb-0">{{ $t('system.informationModal.dataInformation') }}</h2>

              <v-select
                :placeholder="dropdownPlaceholder"
                :items="statuses"
                :label="$t('system.informationModal.ownStatus')"
                item-text="name"
                item-value="value"
                v-model="ownStatusValue"
                dark
              ></v-select>

              <v-text-field
                type="number"
                v-model="ownEpisodeProgressValue"
                :label="$t('system.informationModal.watchedEpisodes')"
                :suffix="`/ ${episodes}`"
                dark
                :rules="[value => !!value || $t('system.informationModal.inputRequired')]"
              ></v-text-field>

              <v-text-field
                type="number"
                v-model="ratingValue"
                :label="$t('system.informationModal.ownRating')"
                suffix="/ 100"
                dark
                :rules="[
                  value => !!value || $t('system.informationModal.inputRequired'),
                  value => value >= 0 && value <= 100 || $t('system.informationModal.ratingError'),
                ]"
              ></v-text-field>

              <v-flex text-xs-center v-if="isInOwnList">
                <v-btn color="success darken-1" small dark @click="submitChanges">
                  {{ $t('system.actions.save') }}
                </v-btn>
                <v-btn color="warning darken-2" small dark @click="resetChanges">
                  {{ $t('system.actions.reset') }}
                </v-btn>
                <v-btn color="error darken-1" small dark @click="deleteFromList">
                  {{ $t('system.actions.remove') }}
                </v-btn>
              </v-flex>
              <v-flex text-xs-center v-else>
                <v-btn color="success darken-1" small dark @click="addToList">
                  {{ $t('system.actions.add') }}
                </v-btn>
              </v-flex>
            </v-flex>
          </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import htmlEntities from 'he';
import { mapState, mapMutations } from 'vuex';
import _, { camelCase, find } from 'lodash';
import EventBus from '@/plugins/eventBus';
import Dropdown from './Dropdown';
import DeleteModal from './DeleteModal';

export default {
  props: ['aniData'],

  components: { Dropdown, DeleteModal },

  data() {
    return {
      dialog: false,
      data: null,
      deleteModalRef: 'informationDeleteModal',
      ownEpisodeProgressValue: 0,
      ownStatusValue: null,
      ratingValue: 0,
    };
  },

  computed: {
    ...mapState('i18n', ['locale']),
    ...mapState('aniList', ['session']),

    statuses() {
      return [{
        value: 'CURRENT',
        name: this.$t('system.listStatus.watching'),
      }, {
        value: 'REPEATING',
        name: this.$t('system.listStatus.repeating'),
      }, {
        value: 'COMPLETED',
        name: this.$t('system.listStatus.completed'),
      }, {
        value: 'PAUSED',
        name: this.$t('system.listStatus.onHold'),
      }, {
        value: 'DROPPED',
        name: this.$t('system.listStatus.dropped'),
      }, {
        value: 'PLANNING',
        name: this.$t('system.listStatus.planned'),
      }];
    },

    isInOwnList() {
      if (!this.data || !this.data.mediaListEntry) {
        return false;
      }

      return true;
    },

    ownRating() {
      if (!this.data || !this.data.mediaListEntry) {
        return null;
      }

      return this.data.mediaListEntry.score;
    },
    ownStatus() {
      if (!this.data || !this.data.mediaListEntry) {
        return null;
      }

      return this.data.mediaListEntry.status;
    },
    watchedEpisodes() {
      if (!this.data || !this.data.mediaListEntry) {
        return null;
      }

      return this.data.mediaListEntry.progress;
    },

    header() {
      if (!this.data) {
        return '';
      }

      return this.data.title.userPreferred;
    },

    description() {
      if (!this.data) {
        return '';
      }

      return this.data.description;
    },

    image() {
      if (!this.data) {
        return '';
      }

      return this.data.coverImage.large;
    },

    episodes() {
      if (!this.data) {
        return '';
      }

      return !this.data.episodes ? '?' : this.data.episodes;
    },

    rating() {
      if (!this.data) {
        return '';
      }

      return this.data.averageScore;
    },

    synonyms() {
      if (!this.data) {
        return '';
      }

      return this.data.synonyms.join(', ') || this.$t('system.informationModal.noSynonyms');
    },

    type() {
      if (!this.data) {
        return '';
      }

      return this.$t(`system.informationModal.${this.data.type.toLowerCase()}`);
    },

    englishName() {
      if (!this.data) {
        return '';
      }

      return this.data.title.english || this.$t('system.informationModal.noEnglishName');
    },

    japaneseName() {
      if (!this.data) {
        return '';
      }

      return this.data.title.native || this.$t('system.informationModal.noJapaneseName');
    },

    seriesStatus() {
      if (!this.data) {
        return '';
      }

      return this.$t(`aniList.mediaInformation.${camelCase(this.data.status)}`);
    },

    airingTime() {
      if (!this.data) {
        return '';
      }

      const start = this.$getMoment({
        year: this.data.startDate.year,
        month: this.data.startDate.month - 1,
        day: this.data.startDate.day,
      });

      const end = this.$getMoment({
        year: this.data.endDate.year,
        month: this.data.endDate.month - 1,
        day: this.data.endDate.day,
      });

      if (start.isSame(end) && start.isValid()) {
        return `${start.format(this.$t('system.informationModal.dateFormat'))}`;
      }

      if (!start.isSame(end) && start.isValid() && end.isValid()) {
        return `${start.format(this.$t('system.informationModal.dateFormat'))} ~ ${end.format(this.$t('system.informationModal.dateFormat'))}`;
      }

      if (start.isValid() && !end.isValid()) {
        return this.$t('system.informationModal.sinceDate', { date: start.format(this.$t('system.informationModal.dateFormat')) });
      }

      return '?';
    },

    deleteModalContent() {
      return this.$t('system.informationModal.doYouReallyWantToDelete', { title: this.header });
    },

    dropdownPlaceholder() {
      return this.$t('system.informationModal.dropdownPlaceholder');
    },
  },

  watch: {
    watchedEpisodes(value) {
      if (!this.data) {
        return;
      }

      this.ownEpisodeProgressValue = value;
    },
    rating() {
      if (!this.data) {
        return;
      }

      this.updateMALRating();
    },
    ownRating(value) {
      if (!this.data) {
        return;
      }

      this.ratingValue = value;
      this.updateOwnRating();
    },
    ownStatus(newValue) {
      if (!this.data) {
        return;
      }

      this.ownStatusValue = newValue;
    },
  },

  methods: {
    checkChangedAnimeStatus(status) {
      // When status was set to finished
      if (status === 'COMPLETED') {
        if (!this.data.episodes) {
          return;
        }

        this.ownEpisodeProgressValue = this.data.episodes;
      }
    },

    deleteFromList() {
      // this.$refs[this.deleteModalRef].show();
    },

    submitDelete() {
      const { id } = this.data.mediaListEntry;
      this.cancelDelete();
      this.show();

      this.$http.deleteAnimeFromList(id, this.session.access_token)
        .then((response) => {
          if (response.data.DeleteMediaListEntry.deleted) {
            this.$notify({
              title: this.$t('system.informationModal.deleted.title'),
              text: this.$t('system.informationModal.deleted.text'),
            });
            this.close();
            this.$emit('refresh');
          }
        })
        .catch((error) => {
          this.$notify({
            type: 'err',
            title: 'ERROR',
            text: error,
          });
        });
    },

    addToList() {
      const scoringSystem = this.session.user.mediaListOptions.scoreFormat;
      let score;

      const progress = this.ownEpisodeProgressValue;
      const status = this.ownStatusValue;
      const mediaId = this.data.id;

      switch (scoringSystem) {
        case 'POINT_10_DECIMAL':
          score = this.ratingValue / 10;
          break;
        case 'POINT_10':
          score = Math.floor(this.ratingValue / 10);
          break;
        case 'POINT_5':
          score = Math.floor(this.ratingValue / 20);
          break;
        case 'POINT_3':
          score = Math.floor(Math.floor(this.ratingValue / 10) / 3);
          break;
        case 'POINT_100':
        default:
          score = this.ratingValue;
          break;
      }

      this.$http.addAnimeToList({ mediaId, score, status, progress }, this.session.access_token)
        .then((response) => {
          if (response.data.SaveMediaListEntry.id) {
            this.$notify({
              title: this.$t('system.informationModal.created.title'),
              text: this.$t('system.informationModal.created.text'),
            });
            this.close();
            this.$emit('refresh');
          }
        })
        .catch((error) => {
          this.$notify({
            type: 'err',
            title: 'ERROR',
            text: error,
          });
        });
    },

    clearRating() {
      this.ratingValue = 0;
      this.updateOwnRating();
    },

    resetChanges() {
      this.ownEpisodeProgressValue = this.data.mediaListEntry.progress;
      this.ownStatusValue = this.data.mediaListEntry.status;
      this.ratingValue = this.data.mediaListEntry.score;
      this.updateOwnRating();
    },

    submitChanges() {
      const scoringSystem = this.session.user.mediaListOptions.scoreFormat;
      let score;

      const progress = this.ownEpisodeProgressValue;
      const status = this.ownStatusValue;
      const { id } = this.data.mediaListEntry;
      const token = this.session.access_token;

      switch (scoringSystem) {
        case 'POINT_10_DECIMAL':
          score = this.ratingValue / 10;
          break;
        case 'POINT_10':
          score = Math.floor(this.ratingValue / 10);
          break;
        case 'POINT_5':
          score = Math.floor(this.ratingValue / 20);
          break;
        case 'POINT_3':
          score = Math.floor(Math.floor(this.ratingValue / 10) / 3);
          break;
        case 'POINT_100':
        default:
          score = this.ratingValue;
          break;
      }

      this.$http.updateAnimeInList({ id, progress, status, score }, token)
        .then((response) => {
          if (response.data.SaveMediaListEntry.id) {
            this.$notify({
              title: this.$t('system.informationModal.updated.title'),
              text: this.$t('system.informationModal.updated.text'),
            });
            this.close();
            this.$emit('refresh');
          }
        })
        .catch((error) => {
          this.$notify({
            type: 'err',
            title: this.$t('system.informationModal.errorResponseTitle'),
            text: error,
          });
        });
    },

    close() {
      this.data = null;
      this.ownEpisodeProgressValue = 0;
      this.ratingValue = 0;
      this.ownStatusValue = null;
      this.dialog = false;
      EventBus.$emit('setOpenInformationId', null);
      EventBus.$emit('setInformation', null);
    },
    show(data) {
      if (!data) {
        return;
      }

      this.data = data;
      this.dialog = true;
    },
    updateRatingValue(value) {
      this.ratingValue = value;
    },
  },
};
</script>

<style scoped>
.ui.basic.segment {
  white-space: pre-line;
}
.ui.basic.segment * {
  white-space: initial;
}
i.yellow.star.icon {
  margin-right: 0;
}
</style>
