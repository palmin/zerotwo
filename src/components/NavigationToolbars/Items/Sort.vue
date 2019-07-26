<template>
  <v-menu v-model="sortMenu" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on: sortWindow }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text icon v-if="isSortingPage" v-on="{ ...toolTip, ...sortWindow }">
            <v-icon>mdi-sort</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('system.actions.sort') }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-container fluid>
        <v-flex xs12 d-flex>
          <v-select :items="['Name']" label="Sort by"></v-select>
        </v-flex>
      </v-container>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sort extends Vue {
  private sortMenu: boolean = false;

  private get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }
}
</script>
