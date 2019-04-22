<template>
  <v-layout align-center justify-end>
    ({{ score }})<v-rating :length="ratingStarAmount" half-increments dense small readonly :value="scoreStars"></v-rating>
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StarRating extends Vue {
  @Prop(Number)
  private score!: number;

  @Prop(Number)
  private ratingStarAmount!: number;

  @Prop(Number)
  private scoreStars!: number;
}
</script>
