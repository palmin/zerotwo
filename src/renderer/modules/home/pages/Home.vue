<template>
  <div class="ui container grid">
    <div class="eight wide column" v-html="escaped">
    </div>
  </div>
</template>

<script>
import os from 'os';

export default {
  computed: {
    escaped() {
      const content = `# BUG REPORT\n\n*Please specify the bug you want to report.*\n\n___\n\nZeroTwo v0.6.0\n\n${os.platform()} ${os.release()}`;
      return content;
    },
  },
};
</script>

