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
    this.$http({
      method: "get",
      url: "/auth/verify"
    })
      .then(resp => {
        this.userInfo = resp.data;
        this.$store.dispatch("changeUserInfo", resp.data);
        // console.log(this.$store.state.userInfo);

        // console.log(this.userInfo);
      })
      .catch(() => {
        this.userInfo = {};
        this.$store.dispatch("changeUserInfo", this.userInfo);
      });
  },
  watch: {
    "$store.state.userInfo"() {
      this.userInfo = this.$store.state.userInfo;
      console.log(this.userInfo);
    }
  },
  mounted() {
    // console.log("main-create");
  },
  methods: {
    newsIsShow(show) {
      if (show) {
        this.$refs.news.searAllDynamic();
      }
    }
  }
};
</script>
<style scoped></style>
