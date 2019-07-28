<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn
        v-if="isSortingPage"
        text
        icon
        v-on="{ ...toolTip }"
        @click="jumpToTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('system.actions.toPageTop') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Top extends Vue {
  private get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  private jumpToTop(): void {
    window.scrollTo(0, 0);
  }
}
</script>
