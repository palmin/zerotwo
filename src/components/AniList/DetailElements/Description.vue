<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline">
          {{ $t('pages.aniList.detailView.description') }}
        </h3>
      </div>
    </v-card-title>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <v-card-text v-html="item.description" />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Description extends Vue {
  @Prop()
  private item!: any;
}
</script>
