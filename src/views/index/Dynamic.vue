<template>
  <v-card style="margin-top:78px" flat width="1114">
    <News
      ref="news"
      v-on:newsIsShow="newsIsShow"
      v-bind:dynamicSearch="dynamicSearch"
      class="news"
    ></News>
  </v-card>
</template>
<script>
import News from "../../components/News";
import { verify } from "../../verify";
export default {
  data: () => ({
    screenWidth: "",
    dynamicSearch: {
      key: "",
      page: 1,
      sortBy: "publishDate",
      desc: true,
      uids: []
    },
    dynamics: [],
    userInfo: {}
  }),
  components: {
    News
  },
  created() {},

  mounted() {
    // console.log("main-create");
  },
  methods: {
    verify,
    newsIsShow(show) {
      this.getFollowerIdByUid();
      if (show && this.dynamicSearch.uids.size <= 0) {
        this.$refs.news.searAllDynamic();
      }
    },
    getFollowerIdByUid() {
      this.$http({
        method: "get",
        url: `/user/follow/queryFollowerIdsByUid/${this.$store.state.userInfo.uid}`
      })
        .then(resp => {
          this.dynamicSearch.uids = resp.data;
        })
        .catch(() => {});
    }
  }
};
</script>
