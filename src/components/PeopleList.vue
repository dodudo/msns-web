<template>
  <v-card height style="overflow-y:auto" flat class="mt-2 pa-2">
    <v-card
      flat
      class="mx-auto pa-0"
      width="700"
      v-show="peopleItems[0] == undefined"
    >
      <v-card-text style="text-align:center">没有数据呢</v-card-text>
    </v-card>
    <v-list class="pa-0 ma-0" two-line>
      <template v-for="(item, index) in peopleItems">
        <v-divider
          v-if="index != 0 && index != peopleItems.length"
          :key="item.uid"
        ></v-divider>
        <v-list-item class="my-3" :key="index">
          <v-list-item-avatar size="60" class="my-0">
            <v-img
              :src="
                item.avatarUrl == null
                  ? require('../assets/default_avatar.jpg')
                  : item.avatarUrl
              "
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.uname }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn @click.stop="favor(index)">{{
              item.favor ? "已关注" : "关注"
            }}</v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <div v-if="totalPage > 1" class="text-center">
      <v-pagination
        v-model="currentPage"
        :length="totalPage"
        :total-visible="7"
      ></v-pagination>
    </div>
  </v-card>
</template>
<script>
import { verify } from "../verify";
export default {
  props: {
    uids: {
      type: Array,
      required: true
    },
    isFan: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    totalPage: 1,
    currentPage: 1,
    pageSize: 5,
    peopleItems: {},
    show: false,
    search: ""
  }),
  mounted() {
    this.show = true;
    this.verify().then(() => {
      this.$emit("peopleListIsShow", this.show);
    });
  },
  watch: {
    currentPage() {
      this.getPeople();
    }
  },
  methods: {
    verify,
    favor(index) {
      if (this.peopleItems[index].favor == true) {
        if (confirm(`您确定要取消关注${this.peopleItems[index].uname}吗？`)) {
          this.peopleItems[index].favor = false;
          this.$http({
            method: "delete",
            url: `/user/follow`,
            params: {
              followersId: this.$store.state.userInfo.uid,
              befollowersId: this.peopleItems[index].uid
            },
            paramsSerializer: params => {
              return this.$qs.stringify(params, { indices: false });
            }
          })
            .then(() => {
              alert("取消关注成功!");
            })
            .catch(() => {
              alert("取消关注失败！");
            });
        }
      } else {
        this.peopleItems[index].favor = true;
        this.$http({
          method: "post",
          url: `/user/follow`,
          params: {
            followersId: this.$store.state.userInfo.uid,
            befollowersId: this.peopleItems[index].uid
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false });
          }
        })
          .then(() => {
            alert("关注成功!");
          })
          .catch(() => {
            alert("关注失败！");
          });
      }
      let obj = Object.assign({}, this.peopleItems[index]);
      this.$set(this.peopleItems, index, obj);
    },
    playMusic() {},
    async getPeople() {
      if (this.uids == null) {
        return;
      }
      await this.$http
        .get("/user/page", {
          params: {
            key: this.search,
            page: this.currentPage, //当前页
            rows: this.pageSize, //每页大小
            sortBy: ["id"], //排序字段
            desc: [true], //是否降序
            isAll: true, //是否查询所有未删除的,
            uids: this.uids
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false });
          }
        })
        .then(resp => {
          this.loading = false;
          this.totalPage = resp.data.total / this.pageSize; //计算总页数
          this.peopleItems = resp.data.items;
          for (let i = 0; i < this.peopleItems.length; i++) {
            this.peopleItems[i].favor = true;
          }
          this.peopleItems = Object.assign({}, this.peopleItems);
          // console.log(this.peopleItems);
          if (this.isFan) {
            this.queryIsMutual();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    queryIsMutual() {
      if (this.uids == null) {
        return;
      }
      this.$http
        .get("/user/follow/queryIsMutual", {
          params: {
            uids: this.uids,
            currentUid: this.$store.state.userInfo.uid
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false });
          }
        })
        .then(resp => {
          // console.log(resp.data);

          var mutualIds = resp.data;
          console.log(this.peopleItems.length);

          //循环遍历查找是否互相关注没有关注的把“已关注”按钮设为“关注"
          for (var i in this.peopleItems) {
            if (mutualIds.indexOf(this.peopleItems[i].uid) == -1) {
              this.peopleItems[i].favor = false;
              let obj = Object.assign({}, this.peopleItems[i]);
              this.$set(this.peopleItems, i, obj);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
