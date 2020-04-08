import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: true,
    playing: false,
    userInfo: {},
    userCountInfo: {},
    user: {},
    favorState: 0,
    music: {},
    musicIndex: null,
    dynamicPush: false,
    unreadCommentCount: 0,
    unreadLikeCount: 0,
  },
  mutations: {
    changeDrawer(state, drawer) {
      state.drawer = drawer;
    },
    changePlaying(state, playing) {
      state.playing = playing;
    },
    changeUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    changeUserCountInfo(state, userCountInfo) {
      state.userCountInfo = userCountInfo;
    },
    changeUser(state, user) {
      state.user = user;
    },
    changeFavorState(state, favorState) {
      state.favorState = favorState;
    },
    changeMusic(state, music) {
      state.music = music;
    },
    changeMusicIndex(state, musicIndex) {
      state.musicIndex = musicIndex;
    },
    changeDynamicPush(state, dynamicPush) {
      state.dynamicPush = dynamicPush;
    },
    changeUnreadCommentCount(state, unreadCommentCount) {
      state.unreadCommentCount = unreadCommentCount;
    },
    changeUnreadLikeCount(state, unreadLikeCount) {
      state.unreadLikeCount = unreadLikeCount;
    }
  },
  actions: {
    changeDrawer(context, drawer) {
      context.commit("changeDrawer", drawer);
    },
    changePlaying(context, playing) {
      context.commit("changePlaying", playing);
    },
    changeUserInfo(context, userInfo) {
      context.commit("changeUserInfo", userInfo);
    },
    changeUserCountInfo(context, userCountInfo) {
      context.commit("changeUserCountInfo", userCountInfo);
    },
    changeUser(context, user) {
      context.commit("changeUser", user);
    },
    changeFavorState(context, favorState) {
      context.commit("changeFavorState", favorState);
    },
    changeMusic(context, music) {
      context.commit("changeMusic", music);
    },
    changeMusicIndex(context, musicIndex) {
      context.commit("changeMusicIndex", musicIndex);
    },
    changeDynamicPush(context, dynamicPush) {
      context.commit("changeDynamicPush", dynamicPush);
    },
    changeUnreadCommentCount(context, unreadCommentCount) {
      context.commit("changeUnreadCommentCount", unreadCommentCount);
    },
    changeUnreadLikeCount(context, unreadLikeCount) {
      context.commit("changeUnreadLikeCount", unreadLikeCount);
    }
  },
  modules: {}
});