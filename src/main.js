import { createApp } from 'vue';
import App from './App.vue';
import router, { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import { setupErrorHandle } from '/@/logics/error-handle';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';
import { isDevMode } from '/@/utils/env';
import '/@/design/index.less';
const app = createApp(App);
// register glob components (注册全局组件)
registerGlobComp(app);
// Multilingual configuration(多语言配置)
setupI18n(app);
// Configure routing(配置路由)
setupRouter(app);
// Configure vuex store(配置vuex存储)
setupStore(app);
// Register global directive(注册全局指令)
setupGlobDirectives(app);
// Configure global error handling（配置全局错误处理）
setupErrorHandle(app);
// Mount when the route is ready
router.isReady().then(() => {
  app.mount('#app', true);
});
// The development environment takes effect
if (isDevMode()) {
  app.config.performance = true;
  window.__APP__ = app;
}
//# sourceMappingURL=main.js.map
