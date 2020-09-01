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
          size: [25, 25],
          title: 'node1',
           comboId: 'combo2', x: 1500, y: 1500,
      error: true,
      nodeType: 'a',
      nodeLevel: 2,
          name: 'card-node2',
          collapse: true,
      ip: '127.0.0.1',
      nodeError: true,
      dataType: 'root',
      keyInfo: 'this is a card node info',
      x: 100,
      y: 50,

          id: "0",//必须
          label: "java",//就是节点名字 
          //shape: 'docker',
          type: 'docker',
          anchorPoints: [
        [0, 1],
        [0.5, 1],
      ],
        },
        {
          size: [25, 25],
                    name: 'cardNodeApp',
                    collapse: true,
          ip: '127.0.0.1',
          nodeError: true,
          dataType: 'root',
          keyInfo: 'this is a card node info',
          x: 100,
          y: 50,
          id: "1",
          label: "ngnix",
          //shape: 'card-node2',
          type: 'docker',
          comboId: '2combo2'
        }
      ],
      edges: [
        {
          label: "Label",
          source: "0",
          target: "1",
          //type:"line-dash",
          style: {
            lineWidth: 2,
            stroke: '#bae7ff',
          }
        },
        {
          label: "Label",
          source: "0",
          target: "1",
          type:"line-dash",
          style: {
            lineWidth: 2,
            stroke: '#bae7ff',
          }
        }
      ],
         combos: [
           
    { id: 'combo2',type:'kubernetes', size:[400,100],zIndex: 1,name: '应用',parentId: 'combo1' },
    { id: 'combo1',type:'kubernetes',size:[500,500],zIndex: 0, name: '集群' },
    //{ id: 'combo3',type:'kubernetes', size:[100,80],name: 'POD',parentId: 'combo2' },

    { id: '2combo2',type:'kubernetes',size:[400,100], zIndex: 1, name: '应用2',parentId: '2combo1' },
    { id: '2combo1',type:'kubernetes',size:[500,500], zIndex: 0,name: '集群2' },
    //{ id: '2combo3',type:'kubernetes',size:[200,80],  name: 'POD2',parentId: '2combo2' },
  ],

    }
  }
  },
  methods: {
    nodeClick: function (item) {
      //alert('click'+ JSON.stringify(item._cfg.model) )      
    },
    afteradditem: function (item) {
      //alert('afteradditem'+  JSON.stringify(item._cfg.model) )      
    },
    beforeremoveitem: function (item) {
      //alert('beforeremoveitem'+JSON.stringify(item._cfg.model) )      
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
