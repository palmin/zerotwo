<template>
  <div class="home">
    <h1>{{ version }}</h1>
    <img alt="Vue logo" :src="require('../assets/logo.png')" />
    <HelloWorld />
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld';
import { Component, Vue } from 'vue-property-decorator';
import { appStore } from '../store';

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  private get version() {
    return appStore.version;
  }
}
</script>
