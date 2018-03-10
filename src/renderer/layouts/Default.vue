<template>
  <div class="ui fluid container">
    <div class="ui stackable two column grid container">
      <div class="sixteen wide column">
        <transition name="fade" mode="out-in">
          <slot/>
        </transition>
      </div>
    </div>
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
