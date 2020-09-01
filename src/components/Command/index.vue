<template>
  <li
    :class="disabled ? 'command-disabled' : 'command'"
    type="primary"
    :disabled="disabled"
    @click="handleClick"
    :icon="getEditorCommandIcon(name)"
  >
    <a class="active" :title="getEditorCommandIconName(name)">
      <span :class="['iconfont ', getEditorCommandIcon(name)]" ></span>
    </a>
    <!-- {{ name }} -->
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EditorEvent,EditorCommandIcon,EditorCommandName} from "@/common/constants";
import { GraphStateEvent } from "@/common/interfaces";
import global from "@/common/global";
import CommandManager from "@/common/commandManager";
import { EditorContextProps } from "@/components/EditorContext";
import eventBus from '@/utils/eventBus'

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
  getEditorCommandIconName(name) {
    return EditorCommandName[name];
  }
  @Watch("$store.state.graph")
  graphChange(to: any, from: any) {
    const graph = this.$store.state.graph;    
    const commandManager: CommandManager = graph.get('commandManager');
    this.disabled = !commandManager.canExecute(graph, this.$props.name);
    graph.on(EditorEvent.onGraphStateChange, () => {
      this.disabled = !commandManager.canExecute(graph, this.$props.name);
    });
  }
    mounted() {
      
      eventBus.$on('command-registered', commandManager => {
        const graph=global.graph;
       this.disabled = !commandManager.canExecute(graph, this.$props.name);
        graph.on(EditorEvent.onGraphStateChange, () => {
        this.disabled = !commandManager.canExecute(graph, this.$props.name);
          });
      })
    
  }

  handleClick() {
    const executeCommand = this.$props.executeCommand;

    executeCommand(this.$props.name);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ggeditor-editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.ggeditor-toolbarElement ul li a {
    display: inline-block;
    width: 27px;
    height: 27px;
    margin: 0 6px;
    padding: 8px 0;
    text-align: center;
    border: 1px solid #fff;
    cursor: pointer;
    color: #333;
}
.ggeditor-toolbarElement .command a:hover {
    border: 1px solid #e6e9ed;
}
.ggeditor-toolbarElement .command-disabled a {
    color: rgba(0,0,0,0.25);
    cursor: auto;
}

</style>
