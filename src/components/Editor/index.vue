<template>
  <div class="editor">
    <el-row class="toolBarPanel">
      <el-col :span="24">
        <div class="toolbar">
          <el-button-group v-for="buttonGroup in FLOW_COMMAND_LIST" :key="buttonGroup.index">
            <Command
              v-for="button in buttonGroup"
              :key="button.index"
              :name="button"
              :executeCommand="executeCommand"
            ></Command>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div>
          <ItemPanel>
            <Item
              :model="{
              shape: 'circle',
              size: 100,
              label: 'circle',
            }"
            >
              <img
                src="https://gw.alicdn.com/tfs/TB1IRuSnRr0gK0jSZFnXXbRRXXa-110-112.png"
                width="55"
                height="56"
                :draggable="false"
              />
            </Item>
            <Item
              :model="{
              shape: 'rect',
              size: [100, 50],
              label: 'rect',
            }"
            >
              <img
                src="https://gw.alicdn.com/tfs/TB1reKOnUT1gK0jSZFrXXcNCXXa-178-76.png"
                width="89"
                height="38"
                :draggable="false"
              />
            </Item>
            <Item
              :model="{
              shape: 'ellipse',
              size: [100, 50],
              label: 'ellipse',
            }"
            >
              <img
                src="https://gw.alicdn.com/tfs/TB1AvmVnUH1gK0jSZSyXXXtlpXa-216-126.png"
                width="108"
                height="63"
                :draggable="false"
              />
            </Item>
            <Item
              :model="{
              shape: 'diamond',
              size: 100,
              label: 'diamond',
            }"
            >
              <img
                src="https://gw.alicdn.com/tfs/TB1EB9VnNz1gK0jSZSgXXavwpXa-178-184.png"
                width="89"
                height="92"
                :draggable="false"
              />
            </Item>
            <Item
              :model="{
              shape: 'bizFlowNode',
              size: [112, 66],
              label: 'bizFlowNode',
              center: 'topLeft',
            }"
            >
              <img
                src="https://gw.alicdn.com/tfs/TB1_cbfnHj1gK0jSZFuXXcrHpXa-244-132.png"
                width="112"
                height="66"
                :draggable="false"
              />
            </Item>
          </ItemPanel>
        </div>
      </el-col>
      <el-col :span="22" class="canvasPanel">
        <Flow :flowProps="flowProps" :setGraph="setGraph" />
      </el-col>
    </el-row>
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
import { CommandEvent } from "@/common/interfaces";
import commandManager from "@/common/commandManager";
import { EditorCommand } from "@/common/constants";
import Flow from "@/components/Flow/index.vue";
import Command from "@/components/Command/index.vue";
import ItemPanel from "@/components/ItemPanel/index.vue";
import Item from "@/components/ItemPanel/Item.vue";
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
  graph: G6.Graph | null = null;
  flowProps = {
    data: {
      nodes: [
        {
          id: "0",
          label: "Node",
          x: 55,
          y: 55
        },
        {
          id: "1",
          label: "Node",
          x: 55,
          y: 255
        }
      ],
      edges: [
        {
          label: "Label",
          source: "0",
          target: "1"
        }
      ]
    }
  };
  FLOW_COMMAND_LIST = [
    [EditorCommand.Undo, EditorCommand.Redo],
    [EditorCommand.Copy, EditorCommand.Paste, EditorCommand.Remove],
    [EditorCommand.ZoomIn, EditorCommand.ZoomOut]
  ];

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
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.toolBarPanel {
  text-align: left;
  margin-bottom: 10px;
  background: #3a93ef;
}
.itemOutSide {
  margin-right: 10px;
  border: 1px solid #e5e5e5;
}
.item {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e5e5;
  padding: 5px 0;
}
.item:last-child {
  border-bottom: none;
}
.canvasPanel{
  border-right: 1px solid #ededed;
}
</style>
