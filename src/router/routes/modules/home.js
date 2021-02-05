import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
const dashboard = {
    path: '/home',
    name: 'Home',
    component: LAYOUT,
    redirect: '/home/welcome',
    meta: {
        icon: 'bx:bx-home',
        title: t('routes.dashboard.welcome'),
    },
    children: [
        {
            path: 'welcome',
            name: 'Welcome',
            component: () => import('/@/views/dashboard/welcome/index.vue'),
            meta: {
                title: t('routes.dashboard.welcome'),
                affix: true,
                icon: 'bx:bx-home',
            },
        },
    ],
};
export default dashboard;
//# sourceMappingURL=home.js.map