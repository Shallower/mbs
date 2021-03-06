import './exception.less';
import { Result, Button } from 'ant-design-vue';
import { defineComponent, ref, computed, unref } from 'vue';
import { ExceptionEnum } from '/@/enums/exceptionEnum';
import netWorkImg from '/@/assets/images/exception/net-work.png';
import notDataImg from '/@/assets/images/no-data.png';
import { useRoute } from 'vue-router';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { PageEnum } from '/@/enums/pageEnum';
import { useI18n } from '/@/hooks/web/useI18n';
export default defineComponent({
    name: 'ErrorPage',
    props: {
        // 状态码
        status: {
            type: Number,
            default: ExceptionEnum.PAGE_NOT_FOUND,
        },
        title: {
            type: String,
        },
        subTitle: {
            type: String,
        },
        full: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const statusMapRef = ref(new Map());
        const { query } = useRoute();
        const go = useGo();
        const redo = useRedo();
        const { t } = useI18n();
        const getStatus = computed(() => {
            const { status: routeStatus } = query;
            const { status } = props;
            return Number(routeStatus) || status;
        });
        const getMapValue = computed(() => {
            return unref(statusMapRef).get(unref(getStatus));
        });
        const backLoginI18n = t('sys.exception.backLogin');
        const backHomeI18n = t('sys.exception.backHome');
        unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_ACCESS, {
            title: '403',
            status: `${ExceptionEnum.PAGE_NOT_ACCESS}`,
            subTitle: t('sys.exception.subTitle403'),
            btnText: props.full ? backLoginI18n : backHomeI18n,
            handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
        });
        unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
            title: '404',
            status: `${ExceptionEnum.PAGE_NOT_FOUND}`,
            subTitle: t('sys.exception.subTitle404'),
            btnText: props.full ? backLoginI18n : backHomeI18n,
            handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
        });
        unref(statusMapRef).set(ExceptionEnum.ERROR, {
            title: '500',
            status: `${ExceptionEnum.ERROR}`,
            subTitle: t('sys.exception.subTitle500'),
            btnText: backHomeI18n,
            handler: () => go(),
        });
        unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
            title: t('sys.exception.noDataTitle'),
            subTitle: '',
            btnText: t('common.redo'),
            handler: () => redo(),
            icon: notDataImg,
        });
        unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
            title: t('sys.exception.networkErrorTitle'),
            subTitle: t('sys.exception.networkErrorSubTitle'),
            btnText: 'Refresh',
            handler: () => redo(),
            icon: netWorkImg,
        });
        return () => {
            const { title, subTitle, btnText, icon, handler, status } = unref(getMapValue) || {};
            return (<Result class="exception " status={status} title={props.title || title} sub-title={props.subTitle || subTitle}>
          {{
                extra: () => btnText && (<Button type="primary" onClick={handler}>
                  {() => btnText}
                </Button>),
                icon: () => (icon ? <img src={icon}/> : null),
            }}
        </Result>);
        };
    },
});
//# sourceMappingURL=Exception.jsx.map