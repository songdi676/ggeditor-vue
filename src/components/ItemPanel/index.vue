<template>
  <div class="ggeditor-itemOutSide"><slot></slot></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import pick from "lodash/pick";
import global from "@/common/global";
import { GraphMode } from "@/common/constants";
import { GShape, GGroup } from '@/common/interfaces';
import { EditorContextProps } from "@/components/EditorContext";

@Component
export default class ItemPanel extends Vue {
  graph = null;

  @Watch("$store.state.graph")
  graphChange(to: any, from: any) {
    this.graph = this.$store.state.graph;
  }

  mounted() {
    this.$nextTick(function() {
      this.graph=global.graph
      document.addEventListener("mouseup", this.handleMouseUp, false);
    });
  }

  beforeDestroy() {
    document.removeEventListener("mouseup", this.handleMouseUp, false);
  }

  handleMouseUp() {
    const graph = global.graph;

    if (graph.getCurrentMode() === GraphMode.Default) {
      return;
    }

    const group: GGroup = graph.get("group");
    const shape: GShape = group.findByClassName(
      global.component.itemPanel.delegateShapeClassName
    ) as GShape;

    if (shape) {
      shape.remove(true);
      graph.paint();
    }

    global.component.itemPanel.model = null;
    graph.setMode(GraphMode.Default);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
