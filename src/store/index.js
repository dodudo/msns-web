import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true,
    playStatus: "mdi-play",
    userInfo: {}
  },
  mutations: {
    changeDrawer(state, drawer) {
      state.drawer = drawer;
    },
    changePalyBtnStatus(state, playStatus) {
      state.playStatus = playStatus;
    },
    changeUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    changeDrawer(context, drawer) {
      context.commit("changeDrawer", drawer);
    },
    changePalyBtnStatus(context, playStatus) {
      context.commit("changePalyBtnStatus", playStatus);
    },
    changeUserInfo(context, userInfo) {
      context.commit("changeUserInfo", userInfo);
    }
  },
  modules: {}
});