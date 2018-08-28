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
              <p>{{ $t('airingTime') }}: {{ airingTime }}</p>
              <p>{{ $t('seriesStatus') }}: {{ seriesStatus }}</p>
            </div>
          </div>

          <div class="six wide column">
            <div class="ui basic segment">
              <h2 class="ui header">
                {{ $t('malDataInformation') }}
              </h2>
              <div class="ui form">
                <div class="field">
                  <label>{{ $t('ownStatus') }}</label>
                  <dropdown
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
                  <label>{{ $t('ownRating') }}</label>
                  <div id="ownRating" class="ui star rating"></div>
                  ({{ ratingValue }})&nbsp;
                  <a class="ui secondary label" @click="clearRating">
                    {{ $t('clear') }}
                  </a>
                </div>
                <template v-if="currentAnime">
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
          {{ description }}
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
import { Builder } from 'xml2js';
import { mapState, mapMutations } from 'vuex';
import { camelCase, find } from 'lodash';
import Dropdown from './Dropdown';
import DeleteModal from './DeleteModal';

export default {
  props: ['data'],

  components: { Dropdown, DeleteModal },

  data() {
    return {
      deleteModalRef: 'informationDeleteModal',
      ownEpisodeProgressValue: 0,
      ownStatusValue: 0,
      ratingValue: 0,
      statuses: [{
        value: '1',
        name: this.$t('watching'),
      }, {
        value: '2',
        name: this.$t('finished'),
      }, {
        value: '3',
        name: this.$t('onHold'),
      }, {
        value: '4',
        name: this.$t('dropped'),
      }, {
        value: '6',
        name: this.$t('planned'),
      }],
    };
  },

  computed: {
    ...mapState('myAnimeList', ['auth', 'malData']),
    ...mapState('i18n', ['locale']),
    currentAnime() {
      const current = find(this.malData, item => item.series_animedb_id === this.data.id);
      if (current === undefined) {
        return null;
      }

      return current;
    },
    ownRating() {
      if (!this.currentAnime) {
        return 0;
      }

      return this.currentAnime.my_score;
    },
    ownStatus() {
      if (!this.currentAnime) {
        return 0;
      }

      return this.currentAnime.my_status;
    },
    watchedEpisodes() {
      if (!this.currentAnime) {
        return 0;
      }

      return this.currentAnime.my_watched_episodes;
    },

    header() {
      if (!this.data) {
        return '';
      }

      return this.data.title;
    },

    description() {
      if (!this.data) {
        return '';
      }

      const replacedString = this.data.synopsis
        .replace(/((<br\s*\/?>)\s*){2,}/gi, '<br>')
        .replace(/<br\s*\/?>/gi, '\n');

      return htmlEntities.decode(replacedString);
    },

    image() {
      return this.data.image;
    },

    episodes() {
      return !Number(this.data.episodes) ? '?' : this.data.episodes;
    },

    rating() {
      return this.data.score;
    },

    synonyms() {
      return this.data.synonyms || this.$t('noSynonyms');
    },

    type() {
      return this.data.type;
    },

    englishName() {
      return this.data.english;
    },

    seriesStatus() {
      return this.$t(camelCase(this.data.status));
    },

    airingTime() {
      let time = '?';
      const start = this.$getDate(this.data.start_date, this.$t('dateFormat'));
      const end = this.$getDate(this.data.end_date, this.$t('dateFormat'));

      if (this.$getMoment(this.data.start_date).isValid()) {
        time = `${start}`;
      }

      if (this.$getMoment(this.data.end_date).isValid()) {
        time = `${time} ~ ${end}`;
      }

      if (this.$getMoment(this.data.start_date).isSame(this.data.end_date)) {
        time = start;
      }

      return time;
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
      this.ownEpisodeProgressValue = value;
    },
    rating() {
      this.updateMALRating();
    },
    ownRating(value) {
      this.ratingValue = value;
      this.updateOwnRating();
    },
    ownStatus(newValue) {
      this.ownStatusValue = newValue;
    },
    locale() {
      this.statuses = [{
        value: '1',
        name: this.$t('watching'),
      }, {
        value: '2',
        name: this.$t('finished'),
      }, {
        value: '3',
        name: this.$t('onHold'),
      }, {
        value: '4',
        name: this.$t('dropped'),
      }, {
        value: '6',
        name: this.$t('planned'),
      }];
    },
  },

  methods: {
    ...mapMutations('myAnimeList', ['setInformation']),

    checkChangedAnimeStatus(status) {
      // When status was set to finished
      if (status === '2') {
        if (!+this.data.episodes) {
          return;
        }

        this.ownEpisodeProgressValue = +this.data.episodes;
      }
    },

    deleteFromList() {
      this.$refs[this.deleteModalRef].show();
    },

    submitDelete() {
      this.cancelDelete();
      this.show();
      this.$http.deleteAnime(this.auth, { id: this.data.id })
        .then((response) => {
          if (response === 'Deleted') {
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
            type: 'err',
            title: this.$t('errorResponseTitle'),
            text: error,
          });
        });
    },

    cancelDelete() {
      this.$refs[this.deleteModalRef].hide();
    },

    addToList() {
      const { id } = this.data;
      const builder = new Builder({ rootName: 'entry' });
      const entry = {
        episode: this.ownEpisodeProgressValue,
        status: this.ownStatusValue,
        score: this.ratingValue,
      };

      const xml = builder.buildObject(entry);

      this.$http.addAnime(this.auth, { id, xml })
        .then((response) => {
          if (response === 'Created') {
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
            type: 'err',
            title: this.$t('errorResponseTitle'),
            text: error,
          });
        });
    },

    clearRating() {
      this.ratingValue = 0;
      this.updateOwnRating();
    },

    resetChanges() {
      this.ownEpisodeProgressValue = this.currentAnime.my_watched_episodes;
      this.ownStatusValue = this.currentAnime.my_status;
      this.ratingValue = this.currentAnime.my_score;
      this.updateOwnRating();
    },

    submitChanges() {
      const builder = new Builder({ rootName: 'entry' });
      const entry = {
        episode: this.ownEpisodeProgressValue,
        status: this.ownStatusValue,
        score: this.ratingValue,
      };

      const xml = builder.buildObject(entry);

      this.$http.updateAnime(this.auth, { id: this.data.id, xml })
        .then((response) => {
          if (response === 'Updated') {
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
            type: 'err',
            title: this.$t('errorResponseTitle'),
            text: error,
          });
        });
    },

    close() {
      this.setInformation(null);
      $(this.$el).modal('hide');
    },
    show() {
      if (!this.data) {
        return;
      }

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
      const score = Number(this.data.score) | 0;
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
</style>


<i18n>
{
  "en": {
    "close": "Close",
    "description": "Description",
    "seriesInformation": "Series Information",
    "malDataInformation": "Information of your MyAnimeList",
    "episodes": "Episodes",
    "rating": "Rating",
    "type": "Type of Series",
    "synonyms": "Synonyms",
    "noSynonyms": "No Synonyms",
    "airingTime": "Airing Time",
    "englishName": "English Name",
    "seriesStatus": "Status of Series",
    "dateFormat": "MMM DD YYYY",
    "unknownDate": "Date unknown",
    "finishedAiring": "Finished Airing",
    "currentlyAiring": "Currently Airing",
    "notYetAired": "Not yet aired",
    "ownRating": "Own Rating",
    "ownStatus": "Own Status",
    "watchedEpisodes": "Watched Episodes",
    "watching": "Watching",
    "finished": "Finished",
    "onHold": "On Hold",
    "dropped": "Dropped",
    "planned": "Planned",
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
    "close": "Schließen",
    "description": "Beschreibung",
    "seriesInformation": "Serieninformationen",
    "malDataInformation": "Informationen deiner MyAnimeList",
    "episodes": "Episoden",
    "rating": "Bewertung",
    "type": "Serientyp",
    "synonyms": "Synonyme",
    "noSynonyms": "Keine Synonyme",
    "airingTime": "Ausstrahlung",
    "englishName": "Englischer Name",
    "seriesStatus": "Serienstatus",
    "dateFormat": "DD. MMM YYYY",
    "unknownDate": "Datum unbekannt",
    "finishedAiring": "Ausstrahlung beendet",
    "currentlyAiring": "Ausstrahlung läuft",
    "notYetAired": "Noch nicht ausgestrahlt",
    "ownRating": "Eigene Bewertung",
    "ownStatus": "Eigener Status",
    "watchedEpisodes": "Episoden geschaut",
    "watching": "Laufend",
    "finished": "Beendet",
    "onHold": "Pausiert",
    "dropped": "Abgebrochen",
    "planned": "Geplant",
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
    "close": "クローズ",
    "description": "デスクリプション",
    "seriesInformation": "シリーズについて",
    "malDataInformation": "自分のMyAnimeList",
    "episodes": "エピソード",
    "rating": "評価",
    "type": "タイプ",
    "synonyms": "シノニム",
    "noSynonyms": "シノニムがありません",
    "airingTime": "放送時間",
    "englishName": "英語名",
    "seriesStatus": "シリーズのステータス",
    "dateFormat": "YYYY[年]MM[月]DD[日]",
    "unknownDate": "日付不明",
    "finishedAiring": "放送終了",
    "currentlyAiring": "放送中",
    "notYetAired": "まだ放送していない",
    "ownRating": "自分の評価",
    "ownStatus": "自分のステータス",
    "watchedEpisodes": "見たエピソード",
    "watching": "見る",
    "finished": "終了",
    "onHold": "中止",
    "dropped": "止めました",
    "planned": "見るつもり",
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
