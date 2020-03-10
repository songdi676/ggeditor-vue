import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    graph: null
  },
  mutations: {
    setgraph(state, graph) {
      state.graph = graph;
    }
  },
  actions: {},
  modules: {}
});
