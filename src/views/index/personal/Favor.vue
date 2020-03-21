<template>
  <v-card class="mt-4 pa-4" width="1112">
    <News ref="news" v-on:newsIsShow="newsIsShow" v-bind:dynamicSearch="dynamicSearch" class="news"></News>
  </v-card>
</template>
<script>
import News from "../../../components/News";
export default {
  components: {
    News
  },

  data: () => ({
    queryFavor: true,
    userInfo: {},
    dynamicSearch: {
      key: "",
      page: 1,
      sortBy: "publishDate",
      desc: true,
      uids: [],
      ids: null
    }
  }),
  created() {},
  watch: {},
  methods: {
    newsIsShow(show) {
      // console.log("favoer");
      this.getFavorDynamicId();
      if (show && this.dynamicSearch.ids != null) {
        this.$refs.news.searAllDynamic();
      }
    },
    getFavorDynamicId() {
      this.$http({
        method: "get",
        url: `/favor/dynamic/queryFavorByUid/${this.$store.state.userInfo.uid}`
      })
        .then(resp => {
          this.dynamicSearch.ids = resp.data;
        })
        .catch(() => {});
    }
  }
};
</script>
