<template>
  <ConfigProvider v-bind="lockEvent" :locale="antConfigLocale">
    <AppProvider>
      <router-view />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';

  import { initAppConfigStore } from '/@/logics/initAppConfig';

  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useLocale } from '/@/locales/useLocale';

  import { AppProvider } from '/@/components/Application';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      // support Multi-language（多语言版本支持）
      const { antConfigLocale, setLocale } = useLocale();
      // 设置语言版本（中/英）
      setLocale();

      // Initialize vuex internal system configuration（初始化vuex内部系统配置）
      initAppConfigStore();

      // Create a lock screen monitor(创建锁屏监视器)
      const lockEvent = useLockPage();
      return {
        antConfigLocale,
        lockEvent,
      };
    },
  });
</script>
