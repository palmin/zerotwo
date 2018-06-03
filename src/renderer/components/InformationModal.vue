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
                {{ $t('seriesInformation') }}
              </h2>
              <p>{{ $t('episodes') }}: {{ episodes }}</p>
              <p>{{ $t('rating') }}:
                <span id="malRating" class="ui star rating"></span> ({{ rating }})
              </p>
              <p>{{ $t('type') }}: {{ type }}</p>
              <p>{{ $t('synonyms') }}: {{ synonyms }}</p>
              <p>{{ $t('englishName') }}: {{ englishName }}</p>
              <p>{{ $t('japaneseName') }}: {{ japaneseName }}</p>
              <p>{{ $t('airingTime') }}: {{ airingTime }}</p>
              <p>{{ $t('seriesStatus') }}: {{ seriesStatus }}</p>
            </div>
          </div>

          <div class="six wide column">
            <div class="ui basic segment">
              <h2 class="ui header">
                {{ $t('dataInformation') }}
              </h2>
              <div class="ui form">
                <div class="field">
                  <label>{{ $t('ownStatus') }}</label>
                  <dropdown
                  ref="informationModalStatusDropdown"
                  :placeholder="dropdownPlaceholder"
                  :items="statuses"
                  :value="ownStatus"
                  v-model="ownStatusValue"
                  @change="checkChangedAnimeStatus" />
                </div>
                <div class="field">
                  <label>{{ $t('watchedEpisodes') }}</label>
                  <div class="ui right labeled input">
                    <input type="number" v-model="ownEpisodeProgressValue" />
                    <div class="ui basic label">
                      / {{ episodes }}
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label>{{ $t('ownRating') }} (0 - 100)</label>
                  <div class="ui right labeled input">
                    <input type="number" min="0" max="100" v-model="ratingValue" />
                    <div class="ui basic label">
                      <i class="yellow star icon"></i>
                    </div>
                  </div>
                </div>
                <template v-if="isInOwnList">
                  <div class="ui right floated primary button" @click="submitChanges">
                    {{ $t('submitChanges') }}
                  </div>
                  <div class="ui right floated secondary button" @click="resetChanges">
                    {{ $t('resetChanges') }}
                  </div>
                  <div class="ui right floated red button" @click="deleteFromList">
                    {{ $t('deleteFromList') }}
                  </div>
                  <delete-modal
                    :ref="deleteModalRef"
                    :submitHandler="submitDelete"
                    :cancelHandler="cancelDelete"
                    :header="$t('deleteModalHeader')"
                    :content="deleteModalContent"
                  />
                </template>
                <template v-else>
                  <div class="ui right floated secondary button" @click="addToList">
                    {{ $t('addToList') }}
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
            {{ $t('description') }}
          </h3>
          <div v-html="description"></div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui button" @click="close">{{ $t('close') }}</div>
    </div>
  </div>
</template>

<script>
import htmlEntities from 'he';
import { mapState, mapMutations } from 'vuex';
import _, { camelCase, find } from 'lodash';
import VueSlider from 'vue-slider-component';
import EventBus from '@/plugins/eventBus';
import Dropdown from './Dropdown';
import DeleteModal from './DeleteModal';

export default {
  props: ['aniData'],

  components: { Dropdown, DeleteModal, VueSlider },

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
        name: this.$t('watching'),
      }, {
        value: 'REPEATING',
        name: this.$t('repeating'),
      }, {
        value: 'COMPLETED',
        name: this.$t('finished'),
      }, {
        value: 'PAUSED',
        name: this.$t('onHold'),
      }, {
        value: 'DROPPED',
        name: this.$t('dropped'),
      }, {
        value: 'PLANNING',
        name: this.$t('planned'),
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

      return this.data.synonyms.join(', ') || this.$t('noSynonyms');
    },

    type() {
      if (!this.data) {
        return '';
      }

      return this.$t(this.data.type.toLowerCase());
    },

    englishName() {
      if (!this.data) {
        return '';
      }

      return this.data.title.english || this.$t('noEnglishName');
    },

    japaneseName() {
      if (!this.data) {
        return '';
      }

      return this.data.title.native || this.$t('noJapaneseName');
    },

    seriesStatus() {
      if (!this.data) {
        return '';
      }

      return this.$t(camelCase(this.data.status));
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
        return `${start.format(this.$t('dateFormat'))}`;
      } else if (!start.isSame(end) && start.isValid() && end.isValid()) {
        return `${start.format(this.$t('dateFormat'))} ~ ${end.format(this.$t('dateFormat'))}`;
      } else if (start.isValid() && !end.isValid()) {
        return this.$t('sinceDate', { date: start.format(this.$t('dateFormat')) });
      }

      return '?';
    },

    deleteModalContent() {
      return this.$t('doYouReallyWantToDelete', { title: this.header });
    },

    dropdownPlaceholder() {
      return this.$t('dropdownPlaceholder');
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
        name: this.$t('watching'),
      }, {
        value: 'REPEATING',
        name: this.$t('repeating'),
      }, {
        value: 'COMPLETED',
        name: this.$t('finished'),
      }, {
        value: 'PAUSED',
        name: this.$t('onHold'),
      }, {
        value: 'DROPPED',
        name: this.$t('dropped'),
      }, {
        value: 'PLANNING',
        name: this.$t('planned'),
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
              title: this.$t('deleted.title'),
              text: this.$t('deleted.text'),
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
              title: this.$t('created.title'),
              text: this.$t('created.text'),
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
              title: this.$t('updated.title'),
              text: this.$t('updated.text'),
            });
            this.close();
            this.$emit('refresh');
          }
        })
        .catch((error) => {
          this.$notify({
            type: 'error',
            title: this.$t('errorResponseTitle'),
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


<i18n>
{
  "en": {
    "anime": "Anime",
    "manga": "Manga",
    "close": "Close",
    "description": "Description",
    "seriesInformation": "Series Information",
    "dataInformation": "Information of your List",
    "episodes": "Episodes",
    "rating": "Rating",
    "type": "Type of Series",
    "synonyms": "Synonyms",
    "noSynonyms": "No Synonyms",
    "airingTime": "Airing Time",
    "englishName": "English Name",
    "noEnglishName": "No English Name",
    "japaneseName": "Japanese Name",
    "noJapaneseName": "No Japanese Name",
    "seriesStatus": "Status of Series",
    "sinceDate": "Since {date}",
    "dateFormat": "MMM DD YYYY",
    "unknownDate": "Date unknown",
    "finishedAiring": "Finished Airing",
    "currentlyAiring": "Currently Airing",
    "notYetAired": "Not yet aired",
    "ownRating": "Own Rating",
    "ownStatus": "Own Status",
    "watchedEpisodes": "Watched Episodes",
    "current": "Watching",
    "watching": "Watching",
    "repeating": "Repeating",
    "finished": "Finished",
    "completed": "Completed",
    "paused": "Paused",
    "onHold": "On Hold",
    "dropped": "Dropped",
    "planned": "Planned",
    "planning": "Planning",
    "releasing": "Releasing",
    "not_yet_released": "Not yet released",
    "cancelled": "Cancelled",
    "dropdownPlaceholder": "Please select...",
    "submitChanges": "Submit",
    "resetChanges": "Reset",
    "addToList": "Add to List",
    "deleteFromList": "Delete from List",
    "updated": {
      "title": "Updated!",
      "text": "Update was successful!"
    },
    "created": {
      "title": "Created!",
      "text": "Create was successful!"
    },
    "deleted": {
      "title": "Deleted!",
      "text": "Delete was successful!"
    },
    "errorResponseTitle": "Update not successful!",
    "deleteModalHeader": "Confirm delete?",
    "doYouReallyWantToDelete": "Do you really want to delete {title} from your list?",
    "clear": "Set to 0 stars"
  },
  "de": {
    "anime": "Anime",
    "manga": "Manga",
    "close": "Schließen",
    "description": "Beschreibung",
    "seriesInformation": "Serieninformationen",
    "dataInformation": "Informationen deiner Liste",
    "episodes": "Episoden",
    "rating": "Bewertung",
    "type": "Serientyp",
    "synonyms": "Synonyme",
    "noSynonyms": "Keine Synonyme",
    "airingTime": "Ausstrahlung",
    "englishName": "Englischer Name",
    "noEnglishName": "Kein englischer Name vorhanden",
    "japaneseName": "Japanischer Name",
    "noJapaneseName": "Kein japanischer Name vorhanden",
    "seriesStatus": "Serienstatus",
    "sinceDate": "Seit {date}",
    "dateFormat": "DD. MMM YYYY",
    "unknownDate": "Datum unbekannt",
    "finishedAiring": "Ausstrahlung beendet",
    "currentlyAiring": "Ausstrahlung läuft",
    "notYetAired": "Noch nicht ausgestrahlt",
    "ownRating": "Eigene Bewertung",
    "ownStatus": "Eigener Status",
    "watchedEpisodes": "Episoden geschaut",
    "current": "Laufend",
    "watching": "Laufend",
    "repeating": "Wiederholung",
    "finished": "Beendet",
    "completed": "Beendet",
    "paused": "Pausiert",
    "onHold": "Pausiert",
    "dropped": "Abgebrochen",
    "planned": "Geplant",
    "planning": "Geplant",
    "releasing": "Wird ausgestrahlt",
    "not_yet_released": "Ausstrahlung geplant",
    "cancelled": "Abgebrochen",
    "dropdownPlaceholder": "Bitte wählen...",
    "submitChanges": "Speichern",
    "resetChanges": "Zurücksetzen",
    "addToList": "Hinzufügen",
    "deleteFromList": "Entfernen",
    "updated": {
      "title": "Aktualisiert!",
      "text": "Aktualisierung erfolgreich!"
    },
    "created": {
      "title": "Hinzugefügt!",
      "text": "Hinzufügen erfolgreich!"
    },
    "deleted": {
      "title": "Gelöscht!",
      "text": "Löschung erfolgreich!"
    },
    "errorResponseTitle": "Aktualisierung nicht erfolgreich!",
    "deleteModalHeader": "Wirklich löschen?",
    "doYouReallyWantToDelete": "Möchtest du {title} wirklich von deiner Liste löschen?",
    "clear": "Auf 0 Sterne setzen"
  },
  "ja": {
    "anime": "アニメ",
    "manga": "漫画",
    "close": "クローズ",
    "description": "デスクリプション",
    "seriesInformation": "シリーズについて",
    "dataInformation": "自分のリスト情報",
    "episodes": "エピソード",
    "rating": "評価",
    "type": "タイプ",
    "synonyms": "シノニム",
    "noSynonyms": "シノニムがありません",
    "airingTime": "放送時間",
    "englishName": "英語名",
    "noEnglishName": "英語名がありません",
    "japaneseName": "日本語名",
    "noJapaneseName": "日本語名がありません",
    "seriesStatus": "シリーズのステータス",
    "sinceDate": "{date}から放送中",
    "dateFormat": "YYYY[年]MM[月]DD[日]",
    "unknownDate": "日付不明",
    "finishedAiring": "放送終了",
    "currentlyAiring": "放送中",
    "notYetAired": "まだ放送していない",
    "ownRating": "自分の評価",
    "ownStatus": "自分のステータス",
    "watchedEpisodes": "見たエピソード",
    "watching": "見る",
    "current": "見る",
    "repeating": "見直す",
    "finished": "終了",
    "completed": "終了",
    "paused": "中止",
    "onHold": "中止",
    "dropped": "止めました",
    "planned": "見るつもり",
    "planning": "見るつもり",
    "releasing": "放送中",
    "not_yet_released": "放送予定",
    "cancelled": "中止された",
    "dropdownPlaceholder": "選んでください・・・",
    "submitChanges": "保存",
    "resetChanges": "リセット",
    "addToList": "追加",
    "deleteFromList": "削除",
    "updated": {
      "title": "アップデートしました！",
      "text": "アップデートはシンクロしました！"
    },
    "created": {
      "title": "追加しました！",
      "text": "追加はシンクロしました！"
    },
    "deleted": {
      "title": "削除しました！",
      "text": "削除はシンクロしました！"
    },
    "errorResponseTitle": "シンクロは出来ませんでした！",
    "deleteModalHeader": "本当に削除しますか？",
    "doYouReallyWantToDelete": "本当に「{title}」を削除しますか？",
    "clear": "０☆にセット"
  }
}
</i18n>
