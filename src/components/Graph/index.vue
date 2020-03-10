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
  FlowData,
  MindData,
  GraphNativeEvent,
  GraphReactEvent,
  GraphReactEventProps
} from "@/common/interfaces";
import { EditorPrivateContextProps } from "@/components/EditorContext";
import Minimap from "@antv/g6/build/minimap";
import Grid from "@antv/g6/build/grid";

import "./command";
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
  initGraph(width: number, height: number): G6.Graph;
}
@Component
export default class Graph extends Vue {
  graph: G6.Graph | null = null;
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
      showMiniMap,
      showgrid
    } = this.$props.graphProps;
    const { clientWidth = 200, clientHeight = 200 } =
      document.getElementById(containerId) || {};

    // 解析数据
    const data = { ...this.$props.graphProps.data };
    parseData(data);

    // 初始画布
    this.graph = initGraph(clientWidth, 800);

    this.graph.read(data);
    if (!showMiniMap) {
      const minimap = new Minimap();
      this.graph.addPlugin(minimap);
    }
    if (!showgrid) {
      const grid = new Grid();
      this.graph.addPlugin(grid);
    }
    this.focusRootNode(this.graph, data);
    this.graph.setMode("default");

    setGraph(this.graph);

    // 发送埋点
    if (global.trackable) {
      const graphType = isMind(this.graph) ? GraphType.Mind : GraphType.Flow;

      track(graphType);
    }
  }

  focusRootNode(graph: G6.Graph, data: FlowData | MindData) {
    if (!isMind(graph)) {
      return;
    }

    const { id } = data as MindData;

    graph.focusItem(id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
