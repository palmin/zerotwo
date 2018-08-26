<template>
  <div class="ui container grid">
    <div class="eight wide column" v-html="escaped">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { escaped: 'unauthorized' };
  },
};
</script>

