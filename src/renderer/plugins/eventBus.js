import Vue from 'vue';
const EventBus = new Vue({
  data() {
    return {
      informationId: null,
      information: null,
    };
  },
});

export default EventBus;
