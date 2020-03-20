<template>
  <v-app>
    <TopBar v-on:topBarSearchVal="topBarSearchVal"></TopBar>
    <div id="content" style="max-width:1520px;min-width:880px" class="overflow-y-auto">
      <router-view></router-view>
      <RightSidebar class="right-sidebar my-0"></RightSidebar>
    </div>
  </v-app>
</template>
<script>
import TopBar from "../../components/TopBar";
import RightSidebar from "../../components/RightSidebar";
export default {
  data: () => ({
    search: "",
    userInfo: {}
  }),
  methods: {
    topBarSearchVal(searchVal) {
      this.search = searchVal;
      // console.log(this.search);
      if (searchVal != null || searchVal != "") {
        this.$router.push({ path: `/index/search/${this.search}` });
      }
    }
  },
  components: {
    TopBar,
    RightSidebar
  },
  created() {
    // console.log(this.userInfo);
  },
  watch: {
    "$store.state.userInfo"() {
      this.userInfo = this.$store.state.userInfo;
      console.log(this.userInfo);
      this.$store.dispatch("changeUserInfo", this.userInfo);
    }
  }
};
</script>
<style scoped></style>
