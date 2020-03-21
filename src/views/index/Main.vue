<template>
  <v-app>
    <LeftSidebar v-if="userInfo.id != null"></LeftSidebar>
    <Edit></Edit>
    <News ref="news" v-on:newsIsShow="newsIsShow" v-bind:dynamicSearch="dynamicSearch" class="news"></News>
  </v-app>
</template>
<script>
import News from "../../components/News";
import LeftSidebar from "../../components/LeftSidebar";
import Edit from "../../components/Edit";
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
    News,
    LeftSidebar,
    Edit
  },
  created() {
    this.verify();
  },

  mounted() {
    // console.log("main-create");
  },
  methods: {
    newsIsShow(show) {
      if (show) {
        this.$refs.news.searAllDynamic();
      }
    },
    verify
  }
};
</script>
<style scoped></style>
