<template>
  <div id="app">
    <Editor @node:click="nodeClick" @afteradditem="afteradditem"  @beforeremoveitem="beforeremoveitem"/>
  </div>
</template>

<script>
import Editor from "@/components/Editor/index.vue";
export default {
  name: 'app',
  components: {
    Editor
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
