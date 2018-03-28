<template>
  <notifications classes="zerotwo-style" position="bottom right">
    <template slot="body" slot-scope="props">
      <div class="zerotwo-style" :class="props.item.type">
        <div class="zerotwo-style-icon">
          <i class="icon"
            :class="{
              exclamation: props.item.type === 'error',
              'exclamation triangle': props.item.type === 'warn',
              check: props.item.type === '' || props.item.type === 'success'
            }">
          </i>
        </div>
        <div class="zerotwo-style-content">
          <div class="zerotwo-style-title">
            {{ props.item.title }}
          </div>
          <div class="zerotwo-style-text"
                v-html="props.item.text"></div>
        </div>
        <div class="zerotwo-style-close"
              @click="props.close">
          <i class="close icon"></i>
        </div>
      </div>
    </template>
  </notifications>
</template>

<style lang="scss" scoped>
.zerotwo-style {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 10px;
  margin: 5px;
  margin-top: 0;

  &, &.success {
    background: rgb(206, 255, 221);
    border-left: 4px solid #42A85F;
  }

  &.warn {
    background: rgb(252, 207, 139);
    border-left: 4px solid #f48a06;
  }

  &.error {
    background: rgb(219, 67, 67);
    border-left: 4px solid rgb(138, 14, 5);
    color: white;
  }

  &, & > div {
    box-sizing: border-box;
  }

  .zerotwo-style-icon {
    flex: 0 1 auto;
  }
  .zerotwo-style-close {
    flex: 0 1 auto;
    cursor: pointer;
    opacity: 0.2;

    &:hover {
      opacity: 0.8;
    }
  }

  .zerotwo-style-content {
    font-size: 12px;

    .zerotwo-style-title {
      text-transform: uppercase;
      font-weight: bold;
    }

    .zerotwo-style-text {
      word-wrap: break-word !important;
    }
  }
}
</style>
