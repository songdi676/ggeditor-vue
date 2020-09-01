<template>
  <div :id="graphProps.containerId"></div>
</template>

<script lang="ts">
import pick from "lodash/pick";
import { Component, Prop, Vue } from "vue-property-decorator";
import { isMind } from "@/utils";
import { track } from "@/helpers";
import global from "@/common/global";
import {
  GraphType,
  GraphCommonEvent,
  GraphNodeEvent,
  GraphEdgeEvent,
  GraphCanvasEvent,
  GraphCustomEvent
} from "@/common/constants";
import {
  Graph,
  FlowData,
  MindData,
  GraphNativeEvent,
  GraphReactEvent,
  GraphReactEventProps,
} from '@/common/interfaces';
import { EditorPrivateContextProps } from "@/components/EditorContext";
import baseCommands from './command';
import eventBus from '@/utils/eventBus'
import "./behavior";

interface GraphProps
  extends Partial<GraphReactEventProps>,
    EditorPrivateContextProps {
  style?: object;
  className?: string;
  containerId: string;
  showMiniMap: boolean;
  showgrid: boolean;
  data: FlowData | MindData;
  parseData(data: object): void;
  initGraph(width: number, height: number): Graph;
}
@Component
export default class GraphComponent extends Vue {
  graph: Graph | null = null;
  @Prop() private graphProps!: GraphProps;
  mounted() {
    this.initGraph();
    this.bindEvent();
  }

  bindEvent() {
    const graph = this.graph;
    const props = this.$props.graphProps;

    if (!graph) {
      return;
    }

    const events: {
      [propName in GraphReactEvent]: GraphNativeEvent;
    } = {
      ...GraphCommonEvent,
      ...GraphNodeEvent,
      ...GraphEdgeEvent,
      ...GraphCanvasEvent,
      ...GraphCustomEvent
    };

 

    (Object.keys(events) as GraphReactEvent[]).forEach(event => {
      if (typeof props[event] === "function") {
        graph.on(events[event], props[event]);
      }
    });
  }
initGraph() {
     const {
      containerId,
      parseData,
      initGraph,
      setGraph,
      commandManager
    } = this.$props.graphProps;
    const { clientWidth = 200, clientHeight = 200 } = document.getElementById(containerId) || {};

    // 解析数据
    const data = { ...this.$props.graphProps.data };

    parseData(data);

    // 初始画布
    this.graph = initGraph(1600, 1000);
    this.graph.data(data);
    this.graph.render();
    this.focusRootNode(this.graph, data);
    this.graph.setMode('default');

    setGraph(this.graph);

    // 设置命令管理器
    this.graph.set('commandManager', commandManager);

    // 注册命令
    let commands = baseCommands;

    if (isMind(this.graph)) {
      commands = {
        ...commands,
        //...mindCommands,
      };
    }

    Object.keys(commands).forEach(name => {
      commandManager.register(name, commands[name]);
    });
    eventBus.$emit('command-registered', commandManager)
    // 发送埋点
    if (global.trackable) {
      const graphType = isMind(this.graph) ? GraphType.Mind : GraphType.Flow;

      track(graphType);
    }
  }

  focusRootNode(graph: Graph, data: FlowData | MindData) {
    if (!isMind(graph)) {
      return;
    }

    const { id } = data as MindData;

    graph.focusItem(id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvasPanel > div .g6-minimap {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
