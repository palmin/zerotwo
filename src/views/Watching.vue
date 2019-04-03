<template>
  <v-content>
    <v-layout fill-height fluid>
      <v-flex xs12 fill-height>
        <List />
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import List from '@/components/AniList/List.vue';

@Component({
  components: {
    List,
  },
})
export default class Watching extends Vue {}
</script>
