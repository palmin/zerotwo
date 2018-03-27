<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ header }}</div>
    <div class="scrolling content">
      <div class="ui grid">
        <div class="four wide column">
          <img :src="image" :alt="header" class="ui fluid image" />
        </div>
        <div class="twelve wide colum">
          <div class="row">
            {{ $t('episodes') }}: {{ episodes }}
          </div>
          <div class="row">
            {{ $t('rating') }}: <div class="ui star rating"></div> ({{ rating }})
          </div>
        </div>
      </div>
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
import { mapMutations } from 'vuex';
import htmlEntities from 'he';

export default {
  props: ['data'],

  computed: {
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
      return this.data.episodes;
    },

    rating() {
      return this.data.score;
    },
  },

  watch: {
    rating() {
      this.updateRating();
    },
  },

  methods: {
    ...mapMutations('myAnimeList', ['setInformation']),
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
        })
        .modal('show');
    },
    updateRating() {
      // eslint-disable-next-line no-bitwise
      const score = Number(this.data.score) | 0;

      $('.ui.star.rating', this.$el)
        .rating({
          initialRating: score,
          maxRating: 10,
          clearable: false,
        })
        .rating('disable');
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
    "episodes": "Episodes",
    "rating": "Rating"
  },
  "de": {
    "close": "Schließen",
    "description": "Beschreibung",
    "episodes": "Episoden",
    "rating": "Bewertung"
  }
}
</i18n>
