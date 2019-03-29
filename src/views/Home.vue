<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-container fluid>
          <v-flex xs2>
            <ProfileImage />
          </v-flex>
        </v-container>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import ProfileImage from '@/components/AniList/ProfileImage.vue';
import { Component, Vue } from 'vue-property-decorator';
import { appStore } from '../store';

@Component({
  components: {
    ProfileImage,
  },
})
export default class Home extends Vue {
  private get version() {
    return appStore.version;
  }
}
</script>
