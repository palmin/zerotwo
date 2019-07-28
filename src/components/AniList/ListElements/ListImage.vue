<template>
  <v-img
    :src="imageLink"
    height="250px"
    position="50% 35%"
    class="pointerCursor"
    @click.native="moveToDetails(aniListId)"
  >
    <template v-slot:placeholder>
      <v-layout
        fill-height
        align-center
        justify-center
        ma-0
      >
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        />
      </v-layout>
    </template>
    <v-container
      fill-height
      fluid
    >
      <v-layout fill-height>
        <v-flex
          xs12
          align-end
          flexbox
        >
          <span class="title shadowed">{{ name }}</span>
        </v-flex>
      </v-layout>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component
export default class ListImage extends Vue {
  @Prop(String)
  private imageLink!: string;

  @Prop(Number)
  private aniListId!: number;

  @Prop(String)
  private name!: string;

  private moveToDetails(id: number) {
    const aniListId = id.toString();
    const location: RawLocation = { name: 'DetailView', params: { id: aniListId } };
    this.$router.push(location);
  }
}
</script>

<style lang="scss" scoped>
.pointerCursor {
  cursor: pointer;
}

.shadowed {
  color: #FFF;
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}
</style>
