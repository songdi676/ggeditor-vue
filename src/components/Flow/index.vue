<template>
  <Graph
    :graphProps="graphProps"
    :containerId="containerId"
    :parseData="parseData"
    :initGraph="initGraph"
    :data="flowProps.data"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import omit from "lodash/omit";
import merge from "lodash/merge";
import G6 from "@antv/g6";
import { guid } from "@/utils";
import global from "@/common/global";
import { FLOW_CONTAINER_ID, GraphType } from "@/common/constants";
import {
  FlowData,
  GraphEvent,
  GraphReactEventProps
} from "@/common/interfaces";
import behaviorManager from "@/common/behaviorManager";
import Graph from "@/components/Graph/index.vue";

import "./behavior";
interface FlowProps extends Partial<GraphReactEventProps> {
  style?: object;
  className?: string;
  data: FlowData;
  graphConfig?: Partial<G6.GraphOptions>;
  customModes?: (mode: string, behaviors: any) => object;
}

@Component({
  components: {
    Graph
  }
})
export default class Flow extends Vue {
  @Prop() private flowProps!: FlowProps;
  @Prop() private setGraph!: any;
  static defaultProps = {
    graphConfig: {}
  };

  graph: G6.Graph | null = null;

  containerId = `${FLOW_CONTAINER_ID}_${guid()}`;
  graphProps = {
    containerId: this.containerId,
    parseData: this.parseData,
    initGraph: this.initGraph,
    data: this.flowProps.data,
    setGraph: this.setGraph
  };
  canDragNode(e: GraphEvent) {
    return !["anchor", "banAnchor"].some(
      item => item === e.target.get("className")
    );
  }

  canDragOrZoomCanvas(): any {
    const graph = this.graph;

    if (!graph) {
      return false;
    }

    return (
      global.plugin.itemPopover.state === "hide" &&
      global.plugin.contextMenu.state === "hide" &&
      global.plugin.editableLabel.state === "hide"
    );
  }

  parseData(data) {
    const { nodes, edges } = data;

    [...nodes, ...edges].forEach(item => {
      const { id } = item;

      if (id) {
        return;
      }

      item.id = guid();
    });
  }

  initGraph(width: number, height: number) {
    const { containerId } = this;
    const { graphConfig, customModes } = this.$props.flowProps;

    const modes: any = merge(
      behaviorManager.getRegisteredBehaviors(GraphType.Flow),
      {
        default: {
          "drag-node": {
            type: "drag-node",
            enableDelegate: true,
            shouldBegin: this.canDragNode
          },
          "drag-canvas": {
            type: "drag-canvas",
            shouldBegin: this.canDragOrZoomCanvas,
            shouldUpdate: this.canDragOrZoomCanvas
          },
          "zoom-canvas": {
            type: "zoom-canvas",
            shouldUpdate: this.canDragOrZoomCanvas
          },
          "recall-edge": "recall-edge",
          "brush-select": "brush-select"
        }
      }
    );
    Object.keys(modes).forEach(mode => {
      const behaviors = modes[mode];

      modes[mode] = Object.values(
        customModes ? customModes(mode, behaviors) : behaviors
      );
    });

    this.graph = new G6.Graph({
      container: containerId,
      width,
      height,
      modes,
      defaultNode: {
        shape: "bizFlowNode"
      },
      defaultEdge: {
        shape: "bizFlowEdge"
      },
      ...graphConfig
    });
    this.$store.commit("setgraph", this.graph);
    return this.graph;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
