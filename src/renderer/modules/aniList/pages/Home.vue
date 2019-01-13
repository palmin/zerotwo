<template>
  <v-content>
    <v-container grid-list-xs fluid :style="`background-image: url(${session.user.bannerImage})`">
      <v-layout row wrap>
        <v-flex xs1>
          <v-img :src="session.user.avatar.medium" />
        </v-flex>
        <v-flex xs1 align-self-end>
          <span class="headline shadowed left-margin">{{ session.user.name }}</span>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: { ...mapState('aniList', ['session']) },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.shadowed {
  text-shadow: 0px 0px 10px #000;
}
.left-margin {
  margin-left: 0.5em;
}
</style>

