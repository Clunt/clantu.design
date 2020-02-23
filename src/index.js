import * as util from './core/util';
import * as libs from './core/libs';

import Trigger from './Trigger';
import Dropdown from './Dropdown';
import Loading from './Loading';
import {
  Menu,
  MenuItem,
  MenuLine
} from './Menu';
import Tooltip from './Tooltip';
import Input from './Input';
import {
  Select,
  SelectOption,
  SelectGroup
} from './Select';
import Button from './Button';
import Row from './Row';
import Col from './Col';
import Spin from './Spin';
import Icon from './Icon';
import Resize from './Resize';
import Scroll from './Scroll';
import Layer from './Layer';
import * as Modal from './Modal';
import { ModalForm } from './Modal';
import Image from './Image';
import { Form, FormItem } from './Form';
import { Tab, TabPane } from './Tab';

import prototypeDialog from './prototype/dialog';
import prototypeAlert from './prototype/alert';
import prototypeConfirm from './prototype/confirm';
import prototypeWait from './prototype/wait';
import prototypeMessage from './prototype/message';

import directiveContextmenu from './directive/contextmenu';

const components = [
  Trigger,
  Dropdown,
  Loading,
  Tooltip,
  Input,
  Button,
  Row,
  Col,
  Spin,
  Icon,
  Resize,
  Scroll,
  Layer,
  Image,
  Menu,
  MenuItem,
  MenuLine,
  Select,
  SelectOption,
  SelectGroup,
  ModalForm,
  Form,
  FormItem,
  Tab,
  TabPane
];

function install(Vue, options) {
  components.forEach(Component => Vue.component(Component.name, Component));

  Vue.directive(directiveContextmenu.name, directiveContextmenu);

  Vue.prototype.$dialog = prototypeDialog;
  Vue.prototype.$alert = prototypeAlert;
  Vue.prototype.$confirm = prototypeConfirm;
  Vue.prototype.$wait = prototypeWait;
  Vue.prototype.$message = prototypeMessage;
}


export default {
  version: '1.0.0',
  install,
};

export {
  util,
  libs,
  Modal,
  Form,
  FormItem,
  Input,
};
