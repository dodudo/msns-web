<template>
  <v-card flat>
    <v-row justify="center">
      <v-col class="ml-2" cols="2">
        <v-card flat>回复我的</v-card>
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
    <v-row class="pa-0">
      <v-list class="mx-6" width="900" height="30%" three-line>
        <v-card class="text-center" flat v-if="comments == null">
          <h5 style="color:grey">还没有评论呢</h5>
        </v-card>

        <v-list-item
          class="mb-2 pb-0"
          v-for="(comment,commentIndex) in comments"
          :key="commentIndex"
        >
          <v-badge
            class="mr-6"
            :value="comment.status == 1"
            bordered
            color="red"
            dot
            offset-x="8"
            offset-y="14"
          >
            <v-avatar size="50">
              <v-img
                :src="comment.replyAvatarUrl == null ? require('../../../assets/default_avatar.jpg') : comment.replyAvatarUrl"
              ></v-img>
            </v-avatar>
          </v-badge>

          <v-list-item-content style="background-color:#F5F5F5" class="px-2 py-0">
            <v-list-item-subtitle class="d-flex justify-space-between">
              <v-card outlined color="rgba(0,0,0,0)" flat style="color:blue">{{comment.replyName}}</v-card>

              <v-card
                outlined
                color="rgba(0,0,0,0)"
                flat
                style="color:#BDBDBD"
              >{{formatDate(comment.commentDate)}}</v-card>
            </v-list-item-subtitle>
            <v-list-item-content
              class="pa-2 caption"
              style="background-color:#EEEEEE;"
            >{{comment.lid == null ? '评论了您：' : '回复了您：'}}{{comment.commentContent}}</v-list-item-content>
            <v-list-item-subtitle>
              <v-row>
                <v-col cols="11">
                  <v-card
                    outlined
                    color="rgba(0,0,0,0)"
                    class="caption"
                    flat
                    style="color:#757575;word-break:break-all;display:-webkit-box;
	                        -webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"
                  >我的{{comment.lid == null ? '动态' : '评论'}}：{{comment.lastCommentContent}}</v-card>
                </v-col>
                <v-col class="px-0" cols="1">
                  <a
                    class="mr-1 caption"
                    style="line-height:22px;text-decoration:underline"
                    @click="comment.show_input = !comment.show_input"
                  >回复</a>
                  <a
                    v-if="comment.status == 1"
                    class="caption"
                    style="line-height:22px;text-decoration:underline;color:red"
                    @click="isRead(comment.id,commentIndex)"
                  >已读</a>
                </v-col>
              </v-row>
            </v-list-item-subtitle>
            <v-divider></v-divider>
            <v-list-item-content class="pa-0" v-show="comment.show_input">
              <v-row align="center">
                <v-col cols="11" class="pa-0">
                  <v-list-item-content class="pb-0">
                    <v-textarea
                      clearable
                      v-model="comment.commentInputContent"
                      clear-icon="mdi-close-circle-outline"
                      :label="'回复'+comment.replyName"
                      class="px-4"
                      :rules="comment.commentRules"
                      outlined
                      flat
                      rows="1"
                    ></v-textarea>
                  </v-list-item-content>
                </v-col>
                <v-col cols="1" class="pa-0">
                  <v-list-item-action class="ma-0 d-flex justify-end">
                    <v-btn
                      small
                      width="50"
                      @click="addComment(comment.pid == null ? comment.id : comment.pid, comment.id, comment.dynamicId,comment.respondentId, comment.replyId,  commentIndex)"
                      class="mr-4"
                    >回复</v-btn>
                  </v-list-item-action>
                </v-col>
              </v-row>
            </v-list-item-content>
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
    show_input: false,
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
    },
    "$store.state.unreadCommentCount"() {
      this.dealComment();
    }
  },
  methods: {
    verify,
    //已读
    isRead(id, commentIndex) {
      this.$http({
        method: "get",
        url: "/comment/updateStateById",
        params: {
          ids: [id],
          status: "2",
          respondentId: this.$store.state.userInfo.uid
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false });
        }
      }).then(() => {
        if (commentIndex != null) {
          this.comments[commentIndex].status = "2";
          this.$store.dispatch(
            "changeUnreadCommentCount",
            (this.$store.state.unreadCommentCount -= 1)
          );
        } else {
          this.$store.dispatch(
            "changeUnreadCommentCount",
            (this.$store.state.unreadCommentCount = 0)
          );
        }
      });
    },
    //新增评论
    addComment(pid, lid, dynamicId, replyId, respondentId, index) {
      // console.log(this.dynamics[index]);

      if (
        this.comments[index].commentInputContent == undefined ||
        this.comments[index].commentInputContent == "" ||
        this.comments[index].commentInputContent == null
      ) {
        this.comments[index].commentRules = [v => !!v || "评论内容不能为空!"];
        this.comments[index].valid = false;
      } else {
        this.comments[index].valid = true;
        this.comments[index].commentRules = [true];
        this.pushComment(
          pid,
          lid,
          dynamicId,
          replyId,
          respondentId,
          this.comments[index].commentInputContent
        ).then(() => {
          this.comments[index].commentInputContent = "";
        });
      }
    },
    async pushComment(
      pid,
      lid,
      dynamicId,
      replyId,
      respondentId,
      commentContent
    ) {
      var comment = {};
      comment.pid = pid;
      comment.lid = lid;
      comment.dynamicId = dynamicId;
      comment.replyId = replyId;
      comment.respondentId = respondentId;
      comment.commentContent = commentContent;
      comment = Object.assign({}, comment);

      await this.$http({
        method: "post",
        url: "/comment/add",
        data: comment
      })
        .then(res => {
          this.snackbar = true;
          this.snackbarText = "评论成功";
          comment = res.data;
          console.log(comment);
        })
        .catch(() => {
          this.snackbar = true;
          this.snackbarText = "评论失败";
          comment = null;
        });
      return comment;
    },
    //处理获取到的评论
    dealComment() {
      this.getComment().then(async res => {
        res = Object.assign({}, res);
        let commentList = res.items;
        for (let i in commentList) {
          // console.log(commentList[i]);
          commentList[i].show_input = false;
          commentList[i].commentInputContent = "";
          commentList[i].commentRules = [];
          commentList[i].valid = true;

          if (commentList[i].pid == null) {
            await this.getDynamicById(commentList[i].dynamicId).then(res => {
              commentList[i].lastCommentContent = res.dynamicContent;
            });
          } else {
            await this.getCommentById(commentList[i].pid).then(res => {
              commentList[i].lastCommentContent = res.commentContent;
            });
          }
          await this.getUserNameAndAvatar(commentList[i].replyId).then(res => {
            commentList[i].replyName = res.uname;
            commentList[i].replyAvatarUrl = res.avatarUrl;
            this.$set(commentList, i, commentList[i]);
          });
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
      this.comment.respondentId = this.$store.state.userInfo.uid;
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
