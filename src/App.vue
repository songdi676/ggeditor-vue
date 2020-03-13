<template>
  <div id="app">
    <Editor :data="flowData" @node:click="nodeClick" @afteradditem="afteradditem"  @beforeremoveitem="beforeremoveitem">
      <template v-slot:item>
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
      </template>
    </Editor>
  </div>
</template>

<script>
import Editor from "@/components/Editor/index.vue";
import Item from "@/components/ItemPanel/Item.vue";
export default {
  name: 'app',
  components: {
    Editor,Item
  },
  data(){
    return   {
    flowData: {
      nodes: [
        {
          id: "0",//必须
          label: "脚本数量：",//就是节点名字
          x: 55,
          y: 55,
          shape: 'bizFlowNode',
          data:[//业务数据岁表定义
            {
              name:"执行sql"
            },
            {
              name:"数据初始化"
            }
          ]
        },
        {
          id: "1",
          label: "应用数量：",
          x: 55,
          y: 255,
          shape: 'bizFlowNode',
          data:[
            {
              name:"启动：app"
            },
            {
              name:"停止app"
            }
          ]
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
  }
  },
  methods: {
    nodeClick: function (item) {
      alert('click'+ JSON.stringify(item._cfg.model) )      
    },
    afteradditem: function (item) {
      alert('afteradditem'+  JSON.stringify(item._cfg.model) )      
    },
    beforeremoveitem: function (item) {
      alert('beforeremoveitem'+JSON.stringify(item._cfg.model) )      
    }
  }
}
</script>

<style>
html,body{
  height: 100%;
}
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
