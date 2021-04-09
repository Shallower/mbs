import { createStore } from 'vuex';
import { config } from 'vuex-module-decorators';
import { isDevMode } from '/@/utils/env';
config.rawError = true;
const isDev = isDevMode();
// const plugins: Plugin<any>[] = isDev ? [createLogger()] : [];
const store = createStore({
  // modules: {},
  strict: isDev,
});
export function setupStore(app) {
  app.use(store);
}
export default store;
//# sourceMappingURL=index.js.map
