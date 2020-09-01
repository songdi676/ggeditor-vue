

import { getSelectedNodes, getSelectedEdges } from '@/utils';
import { GraphState, EditorEvent } from '@/common/constants';
import { EditorContextProps } from '@/components/EditorContext';
import { Node, Edge, GraphStateEvent } from '@/common/interfaces';
import { Component, Prop, Vue } from "vue-property-decorator";
import global from "@/common/global";

type DetailPanelType = 'node' | 'edge' | 'multi' | 'canvas';



@Component
export default class BasePanel extends Vue {

  type = '';
  graphState = '';
  mounted() {
    const graph = global.graph;

    graph.on(EditorEvent.onGraphStateChange, ({ graphState }: GraphStateEvent) => {
      this.graphState = graphState;
    });

  }

  render() {
    const { type, graphState } = this

    if (`${type}-selected` !== graphState) {
      return null
    }
    const graph = global.graph;
    const nodes = getSelectedNodes(graph);
    const edges = getSelectedEdges(graph);
    if (!this.$scopedSlots.default && !this.$slots.default) {
      return
    }
    return (
      <div>
        <slot type={this.type} nodes={nodes} edges={edges} ></slot>
      </div>
    )
  }
}
