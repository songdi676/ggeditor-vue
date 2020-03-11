<template>
  <div class="item" @mousedown="handleMouseDown">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
// import pick from "lodash/pick";
import global from "@/common/global";
import { ItemType, GraphMode } from "@/common/constants";
import { NodeModel } from "@/common/interfaces";
// import { EditorContextProps } from "@/components/EditorContext";

@Component
export default class Item extends Vue {
  @Prop({ default: ItemType.Node }) private type!: ItemType;
  @Prop() private model!: NodeModel;
  graph = null;
  @Watch("$store.state.graph")
  graphChange(to: any, from: any) {
    this.graph = this.$store.state.graph;
  }
  mounted() {
    this.$nextTick(function() {
      this.graph=global.graph
    });
  }
  handleMouseDown() {
    const that = this;
    const graph = that.graph;
    const { type, model } = this.$props;

    if (type === ItemType.Node) {
      global.component.itemPanel.model = model;
      graph.setMode(GraphMode.AddNode);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
