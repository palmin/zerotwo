<template>
  <v-content>
    <v-layout fill-height fluid>
      <v-flex xs12 fill-height>
        <List :status="status" />
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import List from '@/components/AniList/List.vue';
import { AniListListStatus } from '@/modules/AniList/types';

@Component({
  components: {
    List,
  },
})
export default class AniList extends Vue {
  private status!: AniListListStatus;

  private created() {
    this.status = this.$route.meta.status;
  }
}
</script>
