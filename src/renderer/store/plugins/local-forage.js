import _ from 'lodash';
import localForage from 'localforage';

function logError(error) {
  throw error;
}

/**
 * Default init callback handler.
 * @param  {Object} store
 * @param  {Object} savedState
 */
function afterInitDefault(store, savedState) {
  // Just silently hydrate the store without any side effects.
  store.replaceState(_.merge({}, store.state, savedState));
}

/**
 * Reduce store state to contain only the paths we need.
 * @param  {Object} state
 * @param  {String[]} paths
 * @return {Object}
 */
function reduceState(state, paths) {
  // When no paths are defined, we assume the complete store data is needed
  if (!paths.length) {
    return state;
  }

  // Extract the data we need
  return paths.reduce((result, path) => {
    _.set(result, path, _.get(state, path));
    return result;
  }, {});
}

/**
 * Create callback handler to trigger when store is mutated.
 * @param  {String} storageKey
 * @param  {String[]} persistPaths
 * @param  {Function} mutationFilter
 * @return {Function}
 */
function createMutationHandler(storageKey, persistPaths, mutationFilter) {
  return (mutation, state) => {
    // We do not want this action to trigger state persist
    if (!mutationFilter(mutation)) return;

    // Store the reduced state into bwoser storage
    localForage
      .setItem(storageKey, reduceState(state, persistPaths))
      .catch(logError);
  };
}

export default function createLocalForageState(options = {}) {
  const {
    // Browser storage key to hold the state data.
    storageKey = 'vuex',
    // State paths we want to persist.
    // Persist the whole state by default.
    persistPaths = [],
    // Filter what store mutations trigger the persist action.
    // Any mutation triggers it by default.
    mutationFilter = () => true,
    // Callback handler triggered when state is loaded from browser storage.
    // Just hydrates the state by default.
    afterInit = afterInitDefault,
  } = options;

  return (store) => {
    localForage
      .getItem(storageKey)
      .then(savedState => afterInit(store, savedState || {}))
      .then(() => {
        const handler = createMutationHandler(storageKey, persistPaths, mutationFilter);
        store.subscribe(handler);
      })
      .catch(logError);
  };
}
