<template>
  <v-card flat>
    <v-row>
      <v-col class="ml-2" cols="2">全部评论</v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row class="pb-4">
      <v-list class="mx-6" width="900" two-line>
        <v-card class="text-center" flat v-if="comments == null">
          <h5 style="color:grey">还没有评论呢，快去评论吧！</h5>
        </v-card>
        <v-list-item v-for="(comment, index) in comments" :key="index">
          <v-list-item-avatar>
            <v-avatar>
              <v-img
                :src="$store.state.userInfo.avatarUrl == null ? require('../../../assets/default_avatar.jpg') : $store.state.userInfo.avatarUrl"
              ></v-img>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content style="background-color:#F5F5F5" class="px-2">
            <v-list-item-title class="mx-4 d-flex justify-space-between">
              <v-card
                width="660"
                outlined
                color="rgba(0,0,0,0)"
                flat
                class="subtitle caption BLACK"
              >
                <a>{{comment.lid == null ? '评论了' : '回复了'}}{{comment.respondentName}}{{comment.lid == null ? '的动态' : '的评论'}}：</a>
                "{{comment.respondentCommentContent}}"
              </v-card>
              <v-card
                outlined
                color="rgba(0,0,0,0)"
                flat
                class="caption"
                style="color:#BDBDBD"
              >{{formatDate(comment.commentDate)}}</v-card>
            </v-list-item-title>
            <v-list-item-subtitle class="mx-4">
              <v-row>
                <v-col cols="11" class="pa-0">
                  <v-card class="pl-3" color="rgba(0,0,0,0)" flat>{{comment.commentContent}}</v-card>
                </v-col>
                <v-col cols="1" class="pa-0">
                  <v-card
                    outlined
                    color="rgba(0,0,0,0)"
                    flat
                    class="caption pl-5"
                    style="color:#BDBDBD"
                  >
                    <a @click="deleteComment(comment.id,comment.dynamicId)">删除</a>
                  </v-card>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <div v-if="totalPage > 1" class="text-center">
          <v-pagination v-model="currentPage" :length="totalPage" :total-visible="7"></v-pagination>
        </div>
      </v-list>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="1000">
      {{ snackbarText }}
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>
<script>
import { formatDate } from "../../../assets/formatDate";
import { verify } from "../../../verify";
export default {
  data: () => ({
    comment: {},
    comments: {},
    currentPage: 1,
    totalPage: 0,
    commentRequest: {
      key: "",
      page: 1,
      rows: 5,
      sortBy: "commentDate",
      desc: true,
      isAll: true
    },
    snackbarText: "",
    snackbar: false
  }),

  created() {
    this.verify().then(() => {
      this.dealComment();
    });
  },
  watch: {
    currentPage() {
      this.commentRequest.page = this.currentPage;
      this.dealComment();
    }
  },
  methods: {
    verify,
    //删除评论
    deleteComment(id, dynamicId) {
      if (confirm("您确定要删除吗？")) {
        this.$http({
          method: "get",
          url: `/comment/updateStateById/${id}`,
          params: { dynamicId: dynamicId }
        })
          .then(() => {
            this.snackbarText = "删除成功!";
            this.snackbar = true;
            this.dealComment();
          })
          .catch(() => {
            this.snackbarText = "删除失败!";
            this.snackbar = true;
          });
      }
    },
    //处理获取到的评论
    dealComment() {
      this.getComment().then(async res => {
        res = Object.assign({}, res);
        let commentList = res.items;
        for (let i in commentList) {
          // console.log(commentList[i]);

          if (commentList[i].pid == null) {
            await this.getDynamicById(commentList[i].dynamicId).then(res => {
              commentList[i].respondentCommentContent = res.dynamicContent;
            });
          } else {
            await this.getCommentById(commentList[i].pid).then(res => {
              commentList[i].respondentCommentContent = res.commentContent;
            });
          }
          await this.getUserNameAndAvatar(commentList[i].respondentId).then(
            res => {
              commentList[i].respondentName = res.uname;
              this.$set(commentList, i, commentList[i]);
            }
          );
        }
        // console.log(commentList);
        this.comments = Object.assign({}, commentList);
        // console.log(this.comments);
      });
    },
    async getDynamicById(dynamicId) {
      var dynamicResp = {};
      await this.$http({
        method: "get",
        url: `/dynamic/queryById/${dynamicId}`
      }).then(res => {
        dynamicResp = res.data;
      });
      return dynamicResp;
    },
    async getCommentById(lid) {
      var commentResp = {};
      await this.$http({
        method: "get",
        url: `/comment/id/${lid}`
      }).then(res => {
        commentResp = res.data;
      });
      return commentResp;
    },
    //获取评论
    async getComment() {
      //设置查询评论条件（查询登录用户收到的评论）
      this.comment.commentContent = "";
      this.comment.replyId = this.$store.state.userInfo.uid;
      //转换为对象
      var commentObj = Object.assign({}, this.comment);
      var commentResp = {};
      await this.$http({
        method: "post",
        url: "/comment/page",
        data: commentObj,
        params: this.commentRequest,
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false });
        }
      }).then(res => {
        commentResp = res.data;

        this.totalPage = Math.ceil(res.data.total / this.commentRequest.rows);
        // console.log(this.totalPage);
      });
      return commentResp;
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
