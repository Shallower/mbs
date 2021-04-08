import Icon from './Icon/index';
import { Button } from './Button';
import {
  // Need
  Button as AntButton,
} from 'ant-design-vue';
const compList = [Icon, Button, AntButton.Group];
export function registerGlobComp(app) {
  compList.forEach((comp) => {
    app.component(comp.name, comp);
  });
  // Optional
  // If you need to customize global components, you can write here
  // If you don’t need it, you can delete it
  // app
  //   .use(Select)
  //   .use(Alert)
  //   .use(Breadcrumb)
  //   .use(Checkbox)
  //   .use(DatePicker)
  //   .use(Radio)
  //   .use(Switch)
  //   .use(Card)
  //   .use(List)
  //   .use(Descriptions)
  //   .use(Tree)
  //   .use(Table)
  //   .use(Divider)
  //   .use(Modal)
  //   .use(Drawer)
  //   .use(Dropdown)
  //   .use(Tag)
  //   .use(Tooltip)
  //   .use(Badge)
  //   .use(Popover)
  //   .use(Upload)
  //   .use(Transfer)
  //   .use(Steps)
  //   .use(PageHeader)
  //   .use(Result)
  //   .use(Empty)
  //   .use(Avatar)
  //   .use(Menu)
  //   .use(Tabs)
  //   .use(Form)
  //   .use(Input)
  //   .use(Row)
  //   .use(Col)
  //   .use(Spin);
}
//# sourceMappingURL=registerGlobComp.js.map
