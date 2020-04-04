<template>
  <v-app style="width:1518px">
    <div style="width:1518px;">
      <TopBar v-on:topBarSearchVal="topBarSearchVal"></TopBar>
      <div id="content">
        <router-view></router-view>

        <div style="z-index:0">
          <RightSidebar class="right-sidebar my-0"></RightSidebar>
        </div>
      </div>
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
      // console.log(this.userInfo);
    }
  }
};
</script>
<style scoped></style>
