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
        <v-layout row wrap class="ma-2">
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
            <ul class="list">
              <li>{{ $t('system.informationModal.episodes') }}: {{ episodes }}</li>
              <li>{{ $t('system.informationModal.rating') }}: {{ rating }} / 100</li>
              <li>{{ $t('system.informationModal.type') }}: {{ type }}</li>
              <li>{{ $t('system.informationModal.synonyms') }}: {{ synonyms }}</li>
              <li>{{ $t('system.informationModal.englishName') }}: {{ englishName }}</li>
              <li>{{ $t('system.informationModal.japaneseName') }}: {{ japaneseName }}</li>
              <li>{{ $t('system.informationModal.airingTime') }}: {{ airingTime }}</li>
              <li>{{ $t('system.informationModal.seriesStatus') }}: {{ seriesStatus }}</li>
              <li v-if="adultContent" class="red--text">
                <v-layout align-center row wrap>
                  <v-flex xs1>
                    <v-icon color="red darken-2">fas fa-ban</v-icon>
                  </v-flex>
                  <v-flex xs11>
                    {{ $t('system.informationModal.adultContent') }}
                  </v-flex>
                </v-layout>
              </li>
            </ul>
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
              :max="episodes !== '?' ? episodes : ''"
              min="0"
              dark
              :rules="[value => value.length !== 0 || $t('system.informationModal.inputRequired')]"
            ></v-text-field>

            <v-text-field
              type="number"
              v-model="ratingValue"
              :label="$t('system.informationModal.ownRating')"
              suffix="/ 100"
              max="100"
              min="0"
              dark
              :rules="[
                value => value >= 0 && value <= 100 || $t('system.informationModal.ratingError'),
                value => value.length !== 0 || $t('system.informationModal.inputRequired'),
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
                <template v-if="!deleteMode">{{ $t('system.actions.remove') }}</template>
                <template v-else>{{ $t('system.actions.submitDelete') }}</template>
              </v-btn>
            </v-flex>
            <v-flex text-xs-center v-else>
              <v-btn color="success darken-1" small dark @click="addToList">
                {{ $t('system.actions.add') }}
              </v-btn>
            </v-flex>
          </v-flex>
          <v-flex xs12>
            <h2 class="headline mb-0">{{ $t('system.informationModal.description') }}</h2>
            <v-divider></v-divider>
            <section class="mt-2" v-html="description"></section>
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

  data: () => ({
    dialog: false,
    data: null,
    deleteMode: false,
    deleteModalRef: 'informationDeleteModal',
    ownEpisodeProgressValue: 0,
    ownStatusValue: null,
    ratingValue: 0,
  }),

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

    adultContent() {
      if (!this.data) {
        return null;
      }

      return this.data.isAdult;
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
    ownRating(value) {
      if (!this.data) {
        return;
      }

      this.ratingValue = value;
    },
    ownStatus(newValue) {
      if (!this.data) {
        return;
      }

      this.ownStatusValue = newValue;
    },
  },

  methods: {
    ...mapMutations(['setReady']),
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
      if (!this.deleteMode) {
        this.deleteMode = true;
        return;
      }

      this.deleteMode = false;
      this.submitDelete();
    },

    async submitDelete() {
      const { id } = this.data.mediaListEntry;

      await this.setReady(false);

      await this.$http.deleteAnimeFromList(id, this.session.access_token)
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
        })
        .finally(() => {
          this.setReady(true);
        });
    },

    async addToList() {
      const scoringSystem = this.session.user.mediaListOptions.scoreFormat;
      let score;

      const progress = this.ownEpisodeProgressValue;
      const status = this.ownStatusValue || 'CURRENT';
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

      await this.setReady(false);

      await this.$http.addAnimeToList({ mediaId, score, status, progress },
        this.session.access_token)
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

      await this.setReady(true);
    },

    clearRating() {
      this.ratingValue = 0;
    },

    resetChanges() {
      this.ownEpisodeProgressValue = this.data.mediaListEntry.progress;
      this.ownStatusValue = this.data.mediaListEntry.status;
      this.ratingValue = this.data.mediaListEntry.score;
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
      this.deleteMode = false;
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

<style lang="scss" scoped>
.list {
  list-style: none;

  & > li {
    padding: 4px;
  }
}
</style>
