<template>
  <v-card width="1112" class="mt-2">
    <v-card class="mx-2" flat height="54">
      <v-card-title>我的粉丝</v-card-title>
    </v-card>
    <PeopleList ref="peopleList" v-on:peopleListIsShow="peopleListIsShow" v-bind:uids="uids"></PeopleList>
  </v-card>
</template>
<script>
import PeopleList from "../../../components/PeopleList";
export default {
  components: {
    PeopleList
  },
  data: () => ({
    uids: []
  }),
  methods: {
    async getFollowerIdsByUid() {
      await this.$http({
        method: "get",
        url: `/user/follow/queryFanIdsByUid/${this.$store.state.userInfo.uid}`
      })
        .then(resp => {
          this.uids = resp.data;
          // console.log(this.uids);
        })
        .catch(() => {});
    },
    peopleListIsShow(peopleListIsShow) {
      this.getFollowerIdsByUid().then(() => {
        // console.log(this.uids);
        if (peopleListIsShow && this.uids.length != 0) {
          this.$refs.peopleList.getPeople();
        }
      });
    }
  }
};
</script>
