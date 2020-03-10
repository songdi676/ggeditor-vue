<template>
  <el-button
    :class="disabled ? 'command-disabled' : 'command'"
    type="primary"
    :disabled="disabled"
    @click="handleClick"
    :icon="getEditorCommandIcon(name)"
    >{{ name }}</el-button
  >
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EditorEvent, EditorCommandIcon } from "@/common/constants";
import { GraphStateEvent } from "@/common/interfaces";
import commandManager from "@/common/commandManager";
import { EditorContextProps } from "@/components/EditorContext";

interface CommandProps extends EditorContextProps {
  name: string;
  className?: string;
  disabledClassName?: string;
}
@Component
export default class Command extends Vue {
  @Prop() private commandProps!: CommandProps;
  @Prop() private name!: string;
  @Prop() executeCommand: (name: string, params?: object) => void;
  static defaultProps = {
    className: "command",
    disabledClassName: "command-disabled"
  };

  disabled = false;
  getEditorCommandIcon(name) {
    return EditorCommandIcon[name];
  }
  @Watch("$store.state.graph")
  graphChange(to: any, from: any) {
    const graph = this.$store.state.graph;
    this.disabled = !commandManager.canExecute(graph, this.$props.name);
    graph.on(EditorEvent.onGraphStateChange, () => {
      this.disabled = !commandManager.canExecute(graph, this.$props.name);
    });
  }

  handleClick() {
    const executeCommand = this.$props.executeCommand;

    executeCommand(this.$props.name);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
