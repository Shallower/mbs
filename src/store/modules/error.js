var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import store from '/@/store';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { formatToDateTime } from '/@/utils/dateUtil';
import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { useProjectSetting } from '/@/hooks/setting';
const NAME = 'error';
hotModuleUnregisterModule(NAME);
let Error = class Error extends VuexModule {
    constructor() {
        super(...arguments);
        // error log list
        this.errorInfoState = [];
        // error log count
        this.errorListCountState = 0;
    }
    get getErrorInfoState() {
        return this.errorInfoState;
    }
    get getErrorListCountState() {
        return this.errorListCountState;
    }
    commitErrorInfoState(info) {
        const item = {
            ...info,
            time: formatToDateTime(new Date()),
        };
        this.errorInfoState = [item, ...this.errorInfoState];
        this.errorListCountState += 1;
    }
    commitErrorListCountState(count) {
        this.errorListCountState = count;
    }
    setupErrorHandle(error) {
        const { useErrorHandle } = useProjectSetting();
        if (!useErrorHandle)
            return;
        const errInfo = {
            message: error.message,
            type: ErrorTypeEnum.AJAX,
        };
        if (error.response) {
            const { config: { url = '', data: params = '', method = 'get', headers = {} } = {}, data = {}, } = error.response;
            errInfo.url = url;
            errInfo.name = 'Ajax Error!';
            errInfo.file = '-';
            errInfo.stack = JSON.stringify(data);
            errInfo.detail = JSON.stringify({ params, method, headers });
        }
        this.commitErrorInfoState(errInfo);
    }
};
__decorate([
    Mutation
], Error.prototype, "commitErrorInfoState", null);
__decorate([
    Mutation
], Error.prototype, "commitErrorListCountState", null);
__decorate([
    Action
], Error.prototype, "setupErrorHandle", null);
Error = __decorate([
    Module({ dynamic: true, namespaced: true, store, name: NAME })
], Error);
export const errorStore = getModule(Error);
//# sourceMappingURL=error.js.map