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
              <p>{{ $t('rating') }}: <span id="malRating" class="ui star rating"></span> ({{ rating }})</p>
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
                  <dropdown :placeholder="$t('dropdownPlaceholder')" :items="statuses" :value="ownStatus" v-model="ownStatusValue" />
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
                  <div id="ownRating" class="ui star rating"></div> ({{ ratingValue }})
                </div>
                <div class="ui right floated primary button" @click="submitChanges">
                  {{ $t('submitChanges') }}
                </div>
                <div class="ui right floated secondary button" @click="resetChanges">
                  {{ $t('resetChanges') }}
                </div>
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

export default {
  props: ['data'],

  components: { Dropdown },

  data() {
    return {
      ownEpisodeProgressValue: 0,
      ownStatusValue: 0,
      ratingValue: 0,
      statuses: [{
        value: '1',
        name: this.$t('airing'),
      }, {
        value: '2',
        name: this.$t('finished'),
      }, {
        value: '3',
        name: this.$t('onHold'),
      }, {
        value: '4',
        name: this.$t('canceled'),
      }, {
        value: '6',
        name: this.$t('planned'),
      }],
    };
  },

  computed: {
    ...mapState('myAnimeList', ['auth', 'malData']),
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
  },

  methods: {
    ...mapMutations('myAnimeList', ['setInformation']),

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
            type: 'error',
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
          initialRating: this.ownRating,
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
    "airing": "Airing",
    "finished": "Finished",
    "onHold": "On Hold",
    "canceled": "Canceled",
    "planned": "Planned",
    "dropdownPlaceholder": "Please select...",
    "submitChanges": "Submit",
    "resetChanges": "Reset",
    "updated": {
      "title": "Updated!",
      "text": "Update was successful!"
    },
    "errorResponseTitle": "Update not successful!"
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
    "airing": "Laufend",
    "finished": "Beendet",
    "onHold": "Pausiert",
    "canceled": "Abgebrochen",
    "planned": "Geplant",
    "dropdownPlaceholder": "Bitte wählen...",
    "submitChanges": "Speichern",
    "resetChanges": "Zurücksetzen",
     "updated": {
      "title": "Aktualisiert!",
      "text": "Aktualisierung erfolgreich!"
    },
    "errorResponseTitle": "Aktualisierung nicht erfolgreich!"
  }
}
</i18n>
