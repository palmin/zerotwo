import Vue from 'vue';
import Router from 'vue-router';

import routes from './routes';
import applyStoreReadyHook from './hooks/store-ready';

Vue.use(Router);

const router = new Router({ routes });

applyStoreReadyHook(router);

export default router;
