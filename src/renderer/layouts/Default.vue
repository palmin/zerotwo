<template>
  <div class="ui fluid container">
    <transition name="fade" mode="out-in">
      <slot/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity .25s;
}

.fade-leave-active {
  transition: opacity .25s;
  opacity: 0;
}
</style>
