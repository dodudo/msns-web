import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true,
    playStatus: "mdi-play",
    userInfo: {},
    userCountInfo: {},
    user: {}
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
    },
    changeUserCountInfo(state, userCountInfo) {
      state.userCountInfo = userCountInfo;
    },
    changeUser(state, user) {
      state.user = user;
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
    },
    changeUserCountInfo(context, userCountInfo) {
      context.commit("changeUserCountInfo", userCountInfo);
    },
    changeUser(context, user) {
      context.commit("changeUser", user);
    }
  },
  modules: {}
});