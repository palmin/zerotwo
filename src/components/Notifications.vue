<template>
  <notifications
    classes="zerotwo-notifications"
    position="top center"
    width="500"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ZeroTwoNotifications extends Vue {}
</script>

<style lang="scss">
.zerotwo-notifications {
  padding: 10px;
  margin: 0 5px 5px;
  font-size: 15px;
  color: #ffffff;
  background: #44A4FC;
  border-left: 5px solid #187FE7;

  .notification-title {
    font-size: 20px;
  }

  &.warn {
    background: #ffb648;
    border-left-color: #f48a06;
  }

  &.error {
    background: #E54D42;
    border-left-color: #B82E24;
  }

  &.success {
    background: #68CD86;
    border-left-color: #42A85F;
  }
}
</style>
