<template>
  <v-card flat>
    <v-row justify="center">
      <v-col class="ml-2" cols="2">
        <v-card flat>我收到的赞</v-card>
      </v-col>
      <v-col></v-col>
      <v-col cols="2">
        <v-btn @click=" isRead(null, null)" text color="red">
          全部已读
          <v-icon color="red">mdi-broom</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="pb-4">
      <v-list class="mx-6" width="900" two-line>
        <v-card class="text-center" flat v-if="likes == null">
          <h5 style="color:grey">还没有赞呢</h5>
        </v-card>
        <v-list-item v-for="(like, index) in likes" class="mb-2" :key="index">
          <v-badge
            class="mr-6"
            :value="like.status == 1"
            bordered
            color="red"
            dot
            offset-x="8"
            offset-y="14"
          >
            <v-avatar>
              <v-img
                :src="like.likerAvatarUrl == null ? require('../../../assets/default_avatar.jpg') : like.likerAvatarUrl"
              ></v-img>
            </v-avatar>
          </v-badge>
          <v-list-item-content style="background-color:#F5F5F5" class="px-2">
            <v-list-item-title class="mx-4 d-flex justify-space-between">
              <v-card
                outlined
                color="rgba(0,0,0,0)"
                flat
                class="caption BLACK"
              >{{like.likerName}}赞了你</v-card>
              <v-card
                outlined
                color="rgba(0,0,0,0)"
                flat
                class="caption"
                style="color:#BDBDBD"
              >{{formatDate(like.likeDate)}}</v-card>
            </v-list-item-title>
            <v-row>
              <v-col cols="11" class="py-0">
                <v-list-item-subtitle class="mx-4">{{like.likeDynamicContent}}</v-list-item-subtitle>
              </v-col>
              <v-col cols="1" class="py-0">
                <a
                  v-if="like.status == 1"
                  class="caption"
                  style="line-height:22px;text-decoration:underline;color:red"
                  @click="isRead(like.id,index)"
                >已读</a>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
        <div v-if="totalPage > 1" class="text-center">
          <v-pagination v-model="currentPage" :length="totalPage" :total-visible="7"></v-pagination>
        </div>
      </v-list>
    </v-row>
  </v-card>
</template>
<script>
import { formatDate } from "../../../assets/formatDate";
import { verify } from "../../../verify";
export default {
  data: () => ({
    likes: { 0: {} },
    currentPage: 1,
    totalPage: 0,
    likeRequest: {
      page: 1,
      rows: 5,
      sortBy: "likeDate",
      desc: true
    }
  }),
  created() {
    this.verify().then(() => {
      this.dealLike();
    });
  },
  watch: {
    currentPage() {
      this.likeRequest.page = this.currentPage;
      this.dealLike();
    },
    "$store.state.unreadLikeCount"() {
      this.dealLike();
    }
  },
  methods: {
    verify,
    //已读
    isRead(id, likeIndex) {
      this.$http({
        method: "get",
        url: "/like/updateStateById",
        params: {
          ids: [id],
          status: "2",
          dynamicAuthorid: this.$store.state.userInfo.uid
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false });
        }
      }).then(() => {
        if (likeIndex != null) {
          this.likes[likeIndex].status = "2";
          this.$store.dispatch(
            "changeUnreadLikeCount",
            (this.$store.state.unreadLikeCount -= 1)
          );
        } else {
          this.$store.dispatch(
            "changeUnreadLikeCount",
            (this.$store.state.unreadLikeCount = 0)
          );
        }
      });
    },
    dealLike() {
      this.getLikes().then(res => {
        this.likes = res;
        this.likes = Object.assign({}, this.likes);
        // console.log(res);
      });
    },

    //获取评论
    async getLikes() {
      //设置查询评论条件（查询登录用户收到的评论）
      var like = {};
      var likes = {};
      like.dynamicAuthorid = this.$store.state.userInfo.uid;

      //转换为对象
      like = Object.assign({}, like);

      await this.$http({
        method: "post",
        url: "/like/page",
        data: like,
        params: this.likeRequest,
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false });
        }
      }).then(async res => {
        likes = res.data.items;
        for (let i in likes) {
          await this.getUserNameAndAvatar(likes[i].likerId).then(async res => {
            await this.getDynamicById(likes[i].dynamicId).then(res => {
              likes[i].likeDynamicContent = res.dynamicContent;
            });
            likes[i].likerName = res.uname;
            likes[i].likerAvatarUrl = res.avatarUrl;
            likes[i] = Object.assign({}, likes[i]);
          });
        }

        likes = Object.assign({}, likes);
        // console.log(this.likes);

        this.totalPage = Math.ceil(res.data.total / this.likeRequest.rows);
        // console.log(this.totalPage);
      });
      return likes;
    },
    async getDynamicById(dynamicId) {
      var dynamicResp = {};
      await this.$http({
        method: "get",
        url: `/dynamic/queryById/${dynamicId}`
      })
        .then(res => {
          dynamicResp = res.data;
        })
        .catch(() => {
          dynamicResp = {};
        });
      return dynamicResp;
    },
    //格式化日期
    formatDate(time) {
      var date = new Date(time);
      var today = new Date();
      if (formatDate(today, "yyyy-MM-dd") == formatDate(date, "yyyy-MM-dd")) {
        return formatDate(date, "hh:mm");
      } else {
        return formatDate(date, "yyyy-MM-dd hh:mm");
      }
    },
    //获取用户名和头像
    async getUserNameAndAvatar(uid) {
      var user = {};
      await this.$http
        .get(`/user/queryNameAvatarById/${uid}`)
        .then(resp => {
          // console.log(resp);

          user = resp.data;
        })
        .catch(err => {
          console.log(err);
        });
      return user;
    }
  }
};
</script>
<style scoped>
.subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
