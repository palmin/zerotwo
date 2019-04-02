<template>
  <v-layout row wrap>
    <v-flex d-flex xs3 v-for="item in listData" :key="item.id">
      <v-card dark>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">
              {{ item.name }}
            </h3>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { chain } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { aniListStore } from '@/store';

@Component
export default class List extends Vue {
  private get headers() {
    return [{
      text: 'Name',
      align: 'left',
      sortable: true,
      value: 'name',
    }];
  }

  private get listData() {
    if (!aniListStore.aniListData.lists.length) {
      return [];
    }

    const listElement = aniListStore.aniListData.lists[0];

    return chain(listElement.entries)
      .map((entry) => {
      const { media } = entry;

      const preferredName = media.title.native ? media.title.native : media.title.userPreferred;

      return {
        id: entry.id,
        name: preferredName,
      };
    })
    .orderBy((entry) => entry.name.toLowerCase(), ['asc'])
    .value();
  }
}
</script>
