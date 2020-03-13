import G6 from '@antv/g6';

import '@/shape';

import * as Util from '@/utils';
import "@/assets/icons/iconfont.css";
import Editor from '@/components/Editor/index.vue';
import Flow from '@/components/Flow/index.vue';
//import Mind from '@/components/Mind';
import Command from '@/components/Command/index.vue';
import ItemPanel from '@/components/ItemPanel/index.vue';
import Item from '@/components/ItemPanel/Item.vue';
//import DetailPanel from '@/components/DetailPanel';
//import { RegisterNode, RegisterEdge, RegisterCommand, RegisterBehavior } from '@/components/Register';
import { baseCommand } from '@/components/Graph/command/base';

//import ItemPopover from '@/plugins/ItemPopover';
//import ContextMenu from '@/plugins/ContextMenu';
//mport EditableLabel from '@/plugins/EditableLabel';

import global from '@/common/global';
import commandManager from '@/common/commandManager';
import behaviorManager from '@/common/behaviorManager';

import "@/assets/icons/iconfont.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from "vue";
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false;

export {
  G6,
  Util,
  Flow,
  //Mind,
  Command,
  Item,
  ItemPanel,
  //DetailPanel,
  //RegisterNode,
  //RegisterEdge,
  //RegisterCommand,
  //RegisterBehavior,
  //withEditorContext,
  baseCommand,
  //ItemPopover,
  //ContextMenu,
  //EditableLabel,
  global,
  commandManager,
  behaviorManager,
};

export default Editor;
