<template>
  <v-card height style="overflow-y:auto" flat class="mt-2 pa-2">
    <v-list class="pa-0 ma-0" two-line>
      <template v-for="(item, index) in peopleItems">
        <v-divider v-if="index!=0 && index!=peopleItems.length" :key="index"></v-divider>
        <v-list-item class="my-3" :key="index">
          <v-list-item-avatar size="60" class="my-0">
            <v-img
              :src="item.avatarUrl == null ? require('../assets/default_avatar.jpg') : item.avatarUrl"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.uname }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn @click.stop="favor(index)">
              {{
              item.favor ? "已关注" : "关注"
              }}
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <div v-if="totalPage > 1 " class="text-center">
      <v-pagination v-model="currentPage" :length="totalPage" :total-visible="7"></v-pagination>
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
        if (confirm("您确定要取消关注吗？")) {
          this.peopleItems[index].favor = !this.peopleItems[index].favor;
        }
      } else {
        this.peopleItems[index].favor = !this.peopleItems[index].favor;
      }
    },
    playMusic() {},
    getPeople() {
      if (this.uids == null) {
        return;
      }
      this.$http
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
          console.log(resp.data);

          this.totalPage = resp.data.total / this.pageSize;

          this.peopleItems = resp.data.items;
          console.log(this.peopleItems);

          for (let i = 1; i < this.peopleItems.length; i += 2) {
            this.peopleItems.splice();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
