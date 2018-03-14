<template>
  <div class="ui fluid container">
    <main-menu :openSettings="openSettings" />
    <settings :ref="event" />
    <transition name="fade" mode="out-in">
      <slot/>
    </transition>
  </div>
</template>

<script>
import MainMenu from '@/components/Menu';
import Settings from '@/components/Settings';

export default {
  components: {
    MainMenu,
    Settings,
  },
  methods: {
    openSettings() {
      this.$refs[this.event].show();
    },
  },
  name: 'app',
  data() {
    return {
      event: 'showSettings',
    };
  },
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
