<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-container fluid fill-height>
          <v-layout row wrap>
            <v-flex xs9>
              <v-text-field v-model="searchInput" label="Name"></v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-select :items="filters" multiple chips></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  private searchInput: string = '';

  private filters = [{
    text: 'on my list',
    value: true,
  }, {
    text: 'contains adult content',
    value: false,
  }, {
    text: 'not yet on my list',
    value: true,
  }];
}
</script>
