<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ header }}</div>
    <div class="scrolling content">
      <div class="ui grid">
        <div class="stretched row">
          <div class="four wide column">
            <img :src="image" :alt="header" class="ui fluid image" />
          </div>

          <div class="six wide column">
            <div class="ui basic segment">
              <h2 class="ui header">
                {{ $t('system.informationModal.seriesInformation') }}
              </h2>
              <p>{{ $t('system.informationModal.episodes') }}: {{ episodes }}</p>
              <p>{{ $t('system.informationModal.rating') }}:
                <span id="malRating" class="ui star rating"></span> ({{ rating }})
              </p>
              <p>{{ $t('system.informationModal.type') }}: {{ type }}</p>
              <p>{{ $t('system.informationModal.synonyms') }}: {{ synonyms }}</p>
              <p>{{ $t('system.informationModal.englishName') }}: {{ englishName }}</p>
              <p>{{ $t('system.informationModal.japaneseName') }}: {{ japaneseName }}</p>
              <p>{{ $t('system.informationModal.airingTime') }}: {{ airingTime }}</p>
              <p>{{ $t('system.informationModal.seriesStatus') }}: {{ seriesStatus }}</p>
            </div>
          </div>

          <div class="six wide column">
            <div class="ui basic segment">
              <h2 class="ui header">
                {{ $t('system.informationModal.dataInformation') }}
              </h2>
              <div class="ui form">
                <div class="field">
                  <label>{{ $t('system.informationModal.ownStatus') }}</label>
                  <dropdown
                  ref="informationModalStatusDropdown"
                  :placeholder="dropdownPlaceholder"
                  :items="statuses"
                  :value="ownStatus"
                  v-model="ownStatusValue"
                  @change="checkChangedAnimeStatus" />
                </div>
                <div class="field">
                  <label>{{ $t('system.informationModal.watchedEpisodes') }}</label>
                  <div class="ui right labeled input">
                    <input type="number" v-model="ownEpisodeProgressValue" />
                    <div class="ui basic label">
                      / {{ episodes }}
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>{{ $t('system.informationModal.ownRating') }} (0 - 100)</label>
                  <div class="ui right labeled input">
                    <input type="number" min="0" max="100" v-model="ratingValue" />
                    <div class="ui basic label">
                      <i class="yellow star icon"></i>
                    </div>
                  </div>
                </div>
                <template v-if="isInOwnList">
                  <div class="ui right floated primary button" @click="submitChanges">
                    {{ $t('system.actions.save') }}
                  </div>
                  <div class="ui right floated secondary button" @click="resetChanges">
                    {{ $t('system.actions.reset') }}
                  </div>
                  <div class="ui right floated red button" @click="deleteFromList">
                    {{ $t('system.actions.remove') }}
                  </div>
                  <delete-modal
                    :ref="deleteModalRef"
                    :submitHandler="submitDelete"
                    :cancelHandler="cancelDelete"
                    :header="$t('system.informationModal.deleteModalHeader')"
                    :content="deleteModalContent"
                  />
                </template>
                <template v-else>
                  <div class="ui right floated secondary button" @click="addToList">
                    {{ $t('system.actions.add') }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui divider"></div>
      <div class="sixteen wide column">
        <div class="ui basic segment">
          <h3 class="ui header">
            {{ $t('system.informationModal.description') }}
          </h3>
          <div v-html="description"></div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui button" @click="close">{{ $t('system.actions.close') }}</div>
    </div>
  </div>
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

    // ratingMax() {
    //   if (!this.session.user || !this.session.user.mediaListOptions) {
    //     return 100;
    //   }

    //   const scoringSystem = this.session.user.mediaListOptions.scoreFormat;
    //   switch (scoringSystem) {
    //     case 'POINT_100':
    //     default:
    //       return 100;
    //     case 'POINT_10_DECIMAL':
    //     case 'POINT_10':
    //       return 10;
    //     case 'POINT_5':
    //       return 5;
    //     case 'POINT_3':
    //       return 3;
    //   }
    // },

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
      } else if (!start.isSame(end) && start.isValid() && end.isValid()) {
        return `${start.format(this.$t('system.informationModal.dateFormat'))} ~ ${end.format(this.$t('system.informationModal.dateFormat'))}`;
      } else if (start.isValid() && !end.isValid()) {
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
    locale() {
      if (!this.data) {
        return;
      }

      this.statuses = [{
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
      this.$refs[this.deleteModalRef].show();
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
            type: 'error',
            title: 'ERROR',
            text: error,
          });
        });
    },

    cancelDelete() {
      this.$refs[this.deleteModalRef].hide();
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

      this.$http.addAnimeToList({
        mediaId, score, status, progress,
      }, this.session.access_token)
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
            type: 'error',
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

      this.$http.updateAnimeInList({
        id, progress, status, score,
      }, token)
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
            type: 'error',
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
      this.$refs.informationModalStatusDropdown.clear();
      EventBus.$emit('setOpenInformationId', null);
      EventBus.$emit('setInformation', null);

      $(this.$el).modal('hide');
    },
    show(data) {
      if (!data) {
        return;
      }

      this.data = data;

      $(this.$el)
        .modal({
          closable: false,
          centered: false,
          autofocus: false,
        })
        .modal('show');
      this.updateOwnRating();
    },
    updateRatingValue(value) {
      this.ratingValue = value;
    },
    updateMALRating() {
      // eslint-disable-next-line no-bitwise
      const score = Math.floor(this.data.averageScore / 10) | 0;
      $('#malRating', this.$el)
        .rating({
          initialRating: score,
          maxRating: 10,
          clearable: false,
        })
        .rating('disable');
    },
    updateOwnRating() {
      $('#ownRating')
        .rating({
          initialRating: this.ratingValue,
          maxRating: 10,
          clearable: false,
          onRate: this.updateRatingValue,
        })
        .rating('enable');
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
