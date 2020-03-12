<template>
  <div id="app">
    <Editor />
  </div>
</template>

<script>
import Editor from "@/components/Editor/index.vue";
export default {
  name: 'app',
  components: {
    Editor
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
