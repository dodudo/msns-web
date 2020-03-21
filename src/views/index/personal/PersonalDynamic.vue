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
    dynamicSearch: {
      key: "",
      page: 1,
      sortBy: "publishDate",
      desc: true,
      uids: []
    },
    userInfo: {}
  }),
  created() {},
  watch: {},
  methods: {
    newsIsShow(show) {
      this.userInfo = this.$store.state.userInfo;
      // console.log(this.userInfo);

      this.dynamicSearch.uids = [this.userInfo.uid];
      if (show) {
        this.$refs.news.searAllDynamic();
      }
    }
  }
};
</script>
