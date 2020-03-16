<template>
  <div class="ggeditor">
    <div class="ggeditor-toolBarPanel ggeditor-row">
      <div class="ggeditor-col-24">
        <div class="ggeditor-toolbarElement">
          <ul v-for="buttonGroup in FLOW_COMMAND_LIST" :key="buttonGroup.index">
            <Command
              v-for="button in buttonGroup"
              :key="button.index"
              :name="button"
              :executeCommand="executeCommand"
            ></Command>
          </ul>
        </div>
      </div>
    </div>
    <div class="ggeditor-mainPanel ggeditor-row">
      <div class="ggeditor-col-3 ggeditor-sideBar">
        <div>
          <ItemPanel>
            <slot name="item"></slot>
          </ItemPanel>
        </div>
      </div>
      <div class="ggeditor-col-21 ggeditor-canvasPanel">
        <Flow :flowProps="flowProps" :setGraph="setGraph" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import isArray from "lodash/isArray";
import pick from "lodash/pick";
import global from "@/common/global";
import {
  RendererType,
  EditorEvent,
  GraphCommonEvent
} from "@/common/constants";
import { CommandEvent, FlowData, MindData } from "@/common/interfaces";
import commandManager from "@/common/commandManager";
import {
  EditorCommand,
  GraphNodeEvent,
  GraphCustomEvent
} from "@/common/constants";
import Flow from "@/components/Flow/index.vue";
import Command from "@/components/Command/index.vue";
import ItemPanel from "@/components/ItemPanel/index.vue";
import Item from "@/components/ItemPanel/Item.vue";
import { GraphStateEvent } from "@/common/interfaces";
import {
  EditorContextProps,
  EditorPrivateContextProps
} from "@/components/EditorContext";
interface EditorProps {
  style?: any;
  className?: string;
  [EditorEvent.onBeforeExecuteCommand]?: (e: CommandEvent) => void;
  [EditorEvent.onAfterExecuteCommand]?: (e: CommandEvent) => void;
}
@Component({
  components: {
    Flow,
    Command,
    ItemPanel,
    Item
  }
})
export default class Editor extends Vue {
  @Prop() private editorProps!: EditorProps;
  @Prop() private data: FlowData | MindData;
  graph: G6.Graph | null = null;
  flowProps = {
    data: {}
  };
  FLOW_COMMAND_LIST = [
    [EditorCommand.Undo, EditorCommand.Redo],
    [EditorCommand.Copy, EditorCommand.Paste, EditorCommand.Remove],
    [EditorCommand.ZoomIn, EditorCommand.ZoomOut]
  ];

  created() {
    this.flowProps = {
      data: this.$props.data
    };
  }

  static setTrackable(trackable: boolean) {
    global.trackable = trackable;
  }
  static defaultProps = {
    [EditorEvent.onBeforeExecuteCommand]: () => {},
    [EditorEvent.onAfterExecuteCommand]: () => {}
  };

  lastMousedownTarget: HTMLElement | null = null;

  shouldTriggerShortcut(graph: G6.Graph, target: HTMLElement | null) {
    const renderer: RendererType = graph.get("renderer");
    const canvasElement = graph.get("canvas").get("el");

    if (!target) {
      return false;
    }

    if (target === canvasElement) {
      return true;
    }

    if (renderer === RendererType.Svg) {
      if (target.nodeName === "svg") {
        return true;
      }

      let parentNode = target.parentNode;

      while (parentNode && parentNode.nodeName !== "BODY") {
        if (parentNode.nodeName === "svg") {
          return true;
        } else {
          parentNode = parentNode.parentNode;
        }
      }

      return false;
    }
  }

  bindEvent(graph: G6.Graph) {
    const props = this.$props.editorProps;
    graph.on<CommandEvent>(EditorEvent.onBeforeExecuteCommand, () => {});
    graph.on<CommandEvent>(EditorEvent.onAfterExecuteCommand, () => {});
    graph.on(GraphNodeEvent.onNodeClick, ({ item }) => {
      this.$emit(GraphNodeEvent.onNodeClick, item);
    });
    graph.on(GraphCustomEvent.onBeforeAddItem, ({ item }) => {
      this.$emit(GraphCustomEvent.onBeforeAddItem, item);
    });
    graph.on(GraphCustomEvent.onAfterAddItem, ({ item }) => {
      this.$emit(GraphCustomEvent.onAfterAddItem, item);
    });
    graph.on(GraphCustomEvent.onAfterRemoveItem, ({ item }) => {
      this.$emit(GraphCustomEvent.onAfterRemoveItem, item);
    });
    graph.on(GraphCustomEvent.onBeforeRemoveItem, ({ item }) => {
      this.$emit(GraphCustomEvent.onBeforeRemoveItem, item);
    });
  }

  bindShortcut(graph: G6.Graph) {
    window.addEventListener(GraphCommonEvent.onMouseDown, e => {
      this.lastMousedownTarget = e.target as HTMLElement;
    });

    graph.on(GraphCommonEvent.onKeyDown, (e: any) => {
      if (!this.shouldTriggerShortcut(graph, this.lastMousedownTarget)) {
        return;
      }

      Object.values(commandManager.command).some(command => {
        const { name, shortcuts } = command;

        const flag = shortcuts.some((shortcut: any) => {
          const { key } = e;

          if (!isArray(shortcut)) {
            return shortcut === key;
          }

          return <string[]>shortcut.every((item, index) => {
            if (index === shortcut.length - 1) {
              return item === key;
            }

            return e[item];
          });
        });

        if (flag) {
          if (commandManager.canExecute(graph, name)) {
            // Prevent default
            e.preventDefault();

            // Execute command
            this.executeCommand(name);

            return true;
          }
        }

        return false;
      });
    });
  }
  getGraph() {
    return this.graph;
  }
  setGraph(graph: G6.Graph) {
    this.graph = graph;
    this.bindEvent(graph);
    this.bindShortcut(graph);
  }

  executeCommand(name: string, params?: object) {
    const graph = this.graph;

    if (graph) {
      commandManager.execute(graph, name, params);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.ggeditor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ggeditor-mainPanel {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
}
.ggeditor-sideBar {
  background-color: #f6f6f6;
  border-right: 1px solid #e6e9ed;
  display: flex;
  justify-content: center;
}
.ggeditor-toolBarPanel {
  border: 1px solid #e6e9ed;
  padding: 2px;
}
.ggeditor-itemOutSide {
  height: 100%;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ggeditor-item {
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}
.ggeditor-item:last-child {
  border-bottom: none;
}
.ggeditor-toolbarElement ul {
  overflow: auto;
  vertical-align: middle;
  float: left;
}
.ggeditor-toolbarElement ul li {
  float: left;
  padding: 0 8px;
  list-style: none;
}
.ggeditor-canvasPanel {
  flex: 1;
  border-right: 1px solid #ededed;
  height: 100%;
}
/* .canvasPanel > div {
  display: flex;
  width: 85.5%;
}*/
.ggeditor-canvasPanel > div .g6-minimap {
  position: absolute;
  top: 0;
  right: 0;
}

/* 布局 */
.ggeditor-row {
  position: relative;
  box-sizing: border-box;
}

[class*="ggeditor-col-"] {
  float: left;
  box-sizing: border-box;
}
.ggeditor-row:after {
  clear: both;
}
.ggeditor-row:after,
.ggeditor-row:before {
  display: table;
  content: "";
}
.ggeditor-col-1 {
  width: 4.16667%;
}
.ggeditor-col-2 {
  width: 8.333333%;
}
.ggeditor-col-3 {
  width: 12.5%;
}
.ggeditor-col-4 {
  width: 16.66667%;
}
.ggeditor-col-5 {
  width: 20.83333%;
}
.ggeditor-col-6 {
  width: 25%;
}
.ggeditor-col-7 {
  width: 29.16667%;
}
.ggeditor-col-8 {
  width: 33.33333%;
}
.ggeditor-col-9 {
  width: 37.5%;
}
.ggeditor-col-10 {
  width: 41.66667%;
}
.ggeditor-col-11 {
  width: 45.83333%;
}
.ggeditor-col-12 {
  width: 50%;
}
.ggeditor-col-13 {
  width: 54.16667%;
}
.ggeditor-col-14 {
  width: 58.33333%;
}
.ggeditor-col-15 {
  width: 62.5%;
}
.ggeditor-col-16 {
  width: 66.66667%;
}
.ggeditor-col-17 {
  width: 70.83333%;
}
.ggeditor-col-18 {
  width: 75%;
}
.ggeditor-col-19 {
  width: 79.16667%;
}
.ggeditor-col-20 {
  width: 83.33333%;
}
.ggeditor-col-21 {
  width: 87.5%;
}
.ggeditor-col-23 {
  width: 95.83333%;
}
.ggeditor-col-22 {
  width: 91.66667%;
}
.ggeditor-col-24 {
  width: 100%;
}
</style>
