<template>
  <v-card flat width="700" class="mx-auto">
    <v-card flat>
      <v-card flat class="mx-auto pa-0" width="700" v-show="dynamics[0]==undefined">
        <v-card-text style="text-align:center">没有动态呢</v-card-text>
      </v-card>
      <v-card
        v-for="(dynamic, index) in dynamics"
        :key="index"
        :max-width="card_width"
        flat
        style="box-shadow:1px 4px 9px rgba(255,0,0,.4); "
        class="mx-auto mb-4 pb-2"
      >
        <v-list-item>
          <v-list-item-avatar size="50" color="grey">
            <v-img
              :src="dynamic.authorAvatar == null ? require('../assets/default_avatar.jpg') : dynamic.authorAvatar"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="body-1">{{dynamic.author}}</v-list-item-title>
            <v-list-item-subtitle class="body-2">{{formatDate(dynamic.publishDate)}}</v-list-item-subtitle>
          </v-list-item-content>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" icon>
                <v-icon color="gray">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn text small v-on="on">举报</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">举报</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="3" sm="6" md="4">
                        <v-radio-group v-model="radioGroup">
                          <v-radio
                            v-for="(radioItem, index) in radioItems"
                            :key="index"
                            :label="`${radioItem.name}`"
                            :value="`${radioItem.value}`"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">提交</v-btn>
                    <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list>
          </v-menu>
        </v-list-item>
        <v-content class="px-4">
          <div
            ref="dynamicContent"
            class="text-content mb-2 dynamic-content"
            :class="{ fold: dynamic.fold }"
            :id="`text_${index}`"
          >{{ dynamic.dynamicContent }}</div>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
              text
              small
              tile
              class="mr-2 mt-n4"
              color="blue"
              v-show="dynamic.btnShow"
              @click="dynamic.fold = !dynamic.fold"
            >{{ dynamic.fold ? "展开" : "收起" }}</v-btn>
          </v-row>
          <v-row>
            <v-col v-show="imgUrl!=''" v-for="(imgUrl,i) in dynamics[index].imgUrls" :key="i">
              <v-img
                :width="dynamics[index].imgUrls.length <= 3 ? 322 : 200"
                v-if="imgUrl!=''"
                :height="dynamics[index].imgUrls.length <= 3 ? 322 : 200"
                :src="imgUrl"
              ></v-img>
            </v-col>
          </v-row>
        </v-content>
        <v-card v-if="dynamic.music != null" style outlined flat class="px-0 my-2 mx-4">
          <v-list class="pa-0">
            <v-list-item style="background-color:#FAFAFA">
              <v-card tile height="40" width="40">
                <v-list-item-avatar class="ma-0" tile>
                  <v-img :src="dynamic.music.musicCoverUrl"></v-img>
                </v-list-item-avatar>

                <v-overlay z-index="1" opacity="0.3" absolute value="true">
                  <v-btn @click="playMusic(dynamic.music)" icon>
                    <v-icon>mdi-play-circle-outline</v-icon>
                  </v-btn>
                </v-overlay>
              </v-card>
              <v-list-item-content class="ml-3">
                <v-list-item-title>{{dynamic.music.musicName}}</v-list-item-title>
                <v-list-item-subtitle>{{dynamic.music.musicAuthor}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-card flat>
                <v-btn @click.stop="favorMusic(dynamic.music)" icon>
                  <v-icon
                    :color="favorMusicIds.indexOf(dynamic.music.id) == -1 ? 'grey' : 'red'"
                  >mdi-heart</v-icon>
                </v-btn>
              </v-card>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card-actions>
          <span class="caption ml-2">浏览次数{{dynamic.viewCount}}</span>
          <v-spacer></v-spacer>
          <v-card flat>
            <v-btn @click="likeDynamic(dynamic,index)" icon>
              <v-icon
                :color="likeDynamicIds.indexOf(dynamic.id)==-1 ? '#757575' : '#73c9e5'"
              >mdi-thumb-up</v-icon>
            </v-btn>
            <span class="caption">{{dynamic.likeCount}}</span>
          </v-card>
          <v-card flat class="mx-3">
            <v-btn @click="favorDynamic(dynamic,index)" icon>
              <v-icon
                :color="favorDynamicIds.indexOf(dynamic.id)==-1 ? '#757575' : 'pink'"
              >mdi-heart</v-icon>
            </v-btn>
            <span class="caption">{{dynamic.favorCount}}</span>
          </v-card>
          <v-card flat>
            <v-btn @click="showComment(index,null)" icon>
              <v-icon>mdi-message-reply</v-icon>
            </v-btn>
            <span class="caption">{{dynamic.commentCount}}</span>
          </v-card>
        </v-card-actions>

        <v-card v-if="dynamic.show_input" flat>
          <v-card flat class="mx-2">
            <v-list class="pa-0" three-line>
              <v-subheader
                style="height:20px"
                v-if="(dynamic.commentTotal/commentRequest.rows) >= commentRequest.page "
              >所有评论</v-subheader>
              <template v-for="(commentItem, index) in dynamic.comments">
                <v-divider v-if="index!=0 && index!=dynamic.comments.length" :key="index+'a'"></v-divider>
                <v-list-item :key="index+'comment'">
                  <v-list-item-content>
                    <v-list-item-content class="pa-0" size="30">
                      <v-row align="center">
                        <v-col cols="1" class="pa-0" style="height:40px">
                          <v-list-item-avatar class="ma-0 ml-4" size="40">
                            <v-img
                              :src="commentItem.replyAvatarUrl == null ? require('../assets/defaultCover.jpg') :commentItem.replyAvatarUrl "
                            ></v-img>
                          </v-list-item-avatar>
                        </v-col>
                        <v-col cols="2" class="py-0" style="height:20px">
                          <v-list-item-title v-html="commentItem.replyName"></v-list-item-title>
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                    <v-list-item-title
                      style="margin-left: 56px"
                      v-html="commentItem.commentContent"
                    ></v-list-item-title>
                    <v-list-item-subtitle style="margin-left: 56px" class="overline">
                      {{formatDate(commentItem.commentDate,'yyyy-MM-dd hh:mm:ss')}}
                      <a>&nbsp;回复</a>
                    </v-list-item-subtitle>
                    <!-- 子评论 -->
                    <v-list-item :key="index+'comment'">
                      <v-list-item-content>
                        <v-list-item-content class="pa-0" size="30">
                          <v-row align="center">
                            <v-col cols="1" class="pa-0" style="height:40px">
                              <v-list-item-avatar class="ma-0 ml-4" size="40">
                                <v-img
                                  :src="commentItem.replyAvatarUrl == null ? require('../assets/defaultCover.jpg') :commentItem.replyAvatarUrl "
                                ></v-img>
                              </v-list-item-avatar>
                            </v-col>
                            <v-col cols="2" class="py-0" style="height:20px">
                              <v-list-item-title v-html="commentItem.replyName"></v-list-item-title>
                            </v-col>
                          </v-row>
                        </v-list-item-content>
                        <v-list-item-title
                          style="margin-left: 56px"
                          v-html="commentItem.commentContent"
                        ></v-list-item-title>
                        <v-list-item-subtitle style="margin-left: 56px" class="overline">
                          {{formatDate(commentItem.commentDate,'yyyy-MM-dd hh:mm:ss')}}
                          <a>&nbsp;回复</a>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <!-- <v-list-item-content class="pa-0" style="height:24px;text-align:center">
                      <a @click="getMoreComment(index,null)" style="color:#73c9e5">更多回复</a>
                    </v-list-item-content>-->
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
            <v-list-item
              v-if="dynamics[index].commentTotal / commentRequest.rows >=
              commentRequest.page"
              class="mb-1"
              color="blue"
              dense
              style="height:24px"
              link
            >
              <v-list-item-content class="pa-0" style="height:24px;text-align:center">
                <div @click="getMoreComment(index,null)" style="color:#73c9e5">更多评论</div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-textarea
            clearable
            clear-icon="mdi-close-circle-outline"
            :label="'评论'+dynamic.author"
            class="px-4 py-2"
            :value="commentContent"
            outlined
            flat
            hide-details
            rows="1"
          ></v-textarea>
          <v-card class="d-flex justify-end my-2" flat>
            <v-btn small width="100" dark color="#BA68C8" class="mr-4 caption">发表评论</v-btn>
          </v-card>
        </v-card>
      </v-card>
      <div v-if="totalPage != 0" class="text-center">
        <v-pagination v-model="currentPage" :length="totalPage" :total-visible="7"></v-pagination>
      </div>
    </v-card>
  </v-card>
</template>
<script>
import { formatDate } from "../assets/formatDate";
import Stomp from "stompjs";
import { verify } from "../verify";
import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from "../mqtt";
export default {
  props: {
    dynamicSearch: {
      type: Object,
      required: true
    },
    queryFavor: {
      type: Boolean
    }
  },
  data: () => ({
    dialog: false,
    dynamics: { 0: {} },
    radioGroup: 1,
    radioItems: [
      { name: "色情低俗", value: "porn" },
      { name: "广告", value: "ad" },
      { name: "政治敏感", value: "politics" },
      { name: "违法", value: "Illegal" },
      { name: "病毒木马", value: "virus" },
      { name: "其他", value: "other" }
    ],
    absolute: true,
    overlay: false,
    hideText: "",
    isfold: false,
    card_width: 700,
    showFoldBtn: false,
    totalPage: 0,
    currentPage: 1,
    newsDynamicSearch: {},
    dynamicClient: Stomp.client(MQTT_SERVICE),
    dynamicUpdate: true,
    userInfo: {},
    show: false,
    favorMusicIds: [],
    likeDynamicIds: [],
    favorDynamicIds: [],
    commentContent: "",
    comment: {},
    commentRequest: {
      key: "",
      page: 1,
      rows: 5,
      sortBy: "commentDate",
      desc: true,
      isAll: true
    },
    dynamicList: [],
    commentList: {},
    commentTotal: 0
  }),
  methods: {
    //新增评论
    // addComment(pid, dynamicId, replyId, respondentId) {},
    //获取更多评论
    async getMoreComment(index, pid) {
      this.commentRequest.page += 1;

      await this.dealCommentData(
        index,
        pid,
        this.commentRequest.page,
        this.commentRequest.rows,
        this.dynamics[index].comments
      ).then(res => {
        this.dynamics[index].comments = res.commentList;
        this.dynamics[index].commentTotal = res.commentTotal;

        this.dynamics[index] = Object.assign({}, this.dynamics[index]);
        this.$set(this.dynamics, index, this.dynamics[index]);
      });
    },
    //显示评论框
    async showComment(index, pid) {
      this.dynamics[index].show_input = !this.dynamics[index].show_input;
      this.commentRequest.page = 1;

      if (this.dynamics[index].show_input) {
        this.dynamics[index].comments = null;
        await this.dealCommentData(
          index,
          pid,
          this.commentRequest.page,
          this.commentRequest.rows,
          this.dynamics[index].comments
        ).then(res => {
          this.dynamics[index].comments = res.commentList;
          this.dynamics[index].commentTotal = res.commentTotal;

          this.dynamics[index] = Object.assign({}, this.dynamics[index]);
          this.$set(this.dynamics, index, this.dynamics[index]);
        });
      }
    },

    async dealCommentData(index, pid, page, rows, oldComments) {
      console.log(oldComments);
      var commentList = [];
      await this.getComment(this.dynamics[index].id, pid).then(async resp => {
        resp = Object.assign({}, resp);
        this.commentTotal = resp.total;

        if (oldComments != null || oldComments != undefined) {
          for (let i in oldComments) {
            commentList.push(oldComments[i]);
          }
        }

        for (let i = 0; i < resp.items.length; i++) {
          commentList.push(resp.items[i]);
        }
        this.commentList = commentList;
        this.commentList = Object.assign({}, this.commentList);

        for (let i = (page - 1) * rows; i < commentList.length; i++) {
          await this.getUserNameAndAvatar(this.commentList[i].replyId).then(
            res => {
              this.commentList[i].replyName = res.uname;
              this.commentList[i].replyAvatarUrl = res.avatarUrl;
              this.$set(this.commentList, i, this.commentList[i]);
            }
          );

          await this.getUserNameAndAvatar(
            this.commentList[i].respondentId
          ).then(res => {
            this.commentList[i].responseName = res.uname;
            this.$set(this.commentList, i, this.commentList[i]);
          });
        }
      });

      var commentInfo = {};
      commentInfo.commentTotal = this.commentTotal;
      commentInfo.commentList = this.commentList;
      return commentInfo;
    },
    //获取评论
    async getComment(dynamicId, pid) {
      this.comment.commentContent = "";
      this.comment.dynamicId = dynamicId;
      this.comment.pid = pid;
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
      });
      return commentResp;
    },

    // 根据分页条件查询动态
    searAllDynamic() {
      this.dynamicSearch.page = this.currentPage;
      // console.log(this.dynamicSearch);
      // console.log(this.queryFavor);
      if (this.queryFavor && this.dynamicSearch.ids.length == 0) {
        console.log(this.dynamicSearch);
        this.dynamics = [];
        return;
      }

      this.$http({
        method: "post",
        url: "/search/dynamic/dynamicPage",
        data: this.dynamicSearch
      }).then(resp => {
        this.dynamics = resp.data.items;
        this.totalPage = resp.data.totalPage;

        // console.log(resp.data);
        for (let i = 0; i < this.dynamics.length; i++) {
          this.dynamics[i].btnShow = false;
          this.dynamics[i].fold = false;
          this.dynamics[i].show_input = false;
          let user = {};
          // 根据用户id查询头像和用户名
          this.getUserNameAndAvatar(this.dynamics[i].uid).then(res => {
            user = res;
            // console.log(user);

            this.dynamics[i].author = user.uname;
            this.dynamics[i].authorAvatar = user.avatarUrl;
          });

          if (this.dynamics[i].imgUrls != null) {
            this.dynamics[i].imgUrls = this.dynamics[i].imgUrls.split(",");
          }
          this.dynamics[i] = Object.assign({}, this.dynamics[i]);
        }
        this.dynamics = Object.assign({}, this.dynamics);
        this.getLikeDynamic();
        this.getFavorDynamic();
        // console.log(this.dynamics[0]);
      });
    },
    //收藏/取消收藏音乐
    favorMusic(music) {
      if (this.favorMusicIds.indexOf(music.id) != -1) {
        if (confirm(`您确定要取消收藏${music.musicName}吗？`)) {
          this.$http({
            method: "delete",
            url: `/favor/music/`,
            params: {
              collectorId: this.$store.state.userInfo.uid,
              musicId: music.id
            },
            paramsSerializer: params => {
              return this.$qs.stringify(params, { indices: false });
            }
          })
            .then(() => {
              this.getFavorMusicId();
              this.$store.dispatch(
                "changeFavorState",
                !this.$store.state.favorState
              );
              alert("取消收藏成功!");
            })
            .catch(() => {
              alert("取消收藏失败！");
            });
        }
      } else {
        this.$http({
          method: "post",
          url: `/favor/music`,
          params: {
            collectorId: this.$store.state.userInfo.uid,
            musicId: music.id
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false });
          }
        })
          .then(() => {
            this.$store.dispatch(
              "changeFavorState",
              !this.$store.state.favorState
            );
            this.getFavorMusicId();
            alert("收藏成功!");
          })
          .catch(() => {
            alert("收藏失败！");
          });
      }
    },
    //点赞|取消点赞
    likeDynamic(dynamic, index) {
      if (
        this.$store.state.userInfo.uid == null ||
        this.$store.state.userInfo.uid == undefined
      )
        return;
      if (this.likeDynamicIds.indexOf(dynamic.id) != -1) {
        this.$http({
          method: "delete",
          url: `/like`,
          data: {
            likerId: this.$store.state.userInfo.uid,
            dynamicId: dynamic.id
          }
        }).then(() => {
          this.getLikeDynamic();
          this.dynamics[index].likeCount -= 1;
        });
      } else {
        this.$http({
          method: "post",
          url: `/like`,
          data: {
            likerId: this.$store.state.userInfo.uid,
            dynamicId: dynamic.id,
            dynamicAuthorid: dynamic.uid
          }
        }).then(() => {
          this.getLikeDynamic();
          this.dynamics[index].likeCount += 1;
        });
      }
    },
    //收藏|取消动态
    favorDynamic(dynamic, index) {
      if (this.favorDynamicIds.indexOf(dynamic.id) != -1) {
        if (confirm(`您确定要取消收藏吗？`)) {
          this.$http({
            method: "delete",
            url: `/favor/dynamic/`,
            data: {
              collectorId: this.$store.state.userInfo.uid,
              dynamicId: dynamic.id
            }
          })
            .then(() => {
              this.getFavorDynamic();
              this.dynamics[index].favorCount -= 1;
              alert("取消收藏成功!");
            })
            .catch(() => {
              alert("取消收藏失败！");
            });
        }
      } else {
        this.$http({
          method: "post",
          url: `/favor/dynamic`,
          data: {
            collectorId: this.$store.state.userInfo.uid,
            dynamicId: dynamic.id
          }
        })
          .then(() => {
            this.getFavorDynamic();
            this.dynamics[index].favorCount += 1;
            alert("收藏成功!");
          })
          .catch(() => {
            alert("收藏失败！");
          });
      }
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
    //控制动态内容是否折叠
    foldControl(dynamicContent) {
      this.$nextTick(() => {
        if (dynamicContent != null) {
          for (let i = 0; i < dynamicContent.length; i++) {
            let textHeight = window
              .getComputedStyle(dynamicContent[i])
              .height.replace("px", "");
            // console.log(textHeight);
            if (textHeight > 120) {
              this.dynamics[i].fold = true;
              this.dynamics[i].btnShow = true;
            }
          }
        }
      });
    },
    //获取用户收藏的音乐id
    async getFavorMusicId() {
      await this.$http({
        method: "get",
        url: `/favor/music/queryByUid/${this.$store.state.userInfo.uid}`
      }).then(resp => {
        // console.log("jhj");
        this.favorMusicIds = resp.data;
      });
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
    //播放音乐
    playMusic(item) {
      //将音乐和音乐所在收藏位置做状态管理
      this.$store.dispatch("changeMusic", item);
      this.$store.dispatch("changeMusicIndex", -1);
    },
    //初始连接
    onConnected: function() {
      //订阅频道
      const topic = "/exchange/msns.dynamic.exchange/dynamic.#";
      this.dynamicClient.subscribe(topic, this.responseCallback, this.onFailed);
      // console.log(fram);
    },
    //当失败时
    onFailed(fram) {
      console.log(fram);
    },
    //当由数据响应时
    responseCallback(fram) {
      this.dynamicUpdate = !this.dynamicUpdate;
      console.log("返回" + fram.body);
    },
    //连接rabbitmq
    connect() {
      const headers = {
        login: MQTT_USERNAME,
        passcode: MQTT_PASSWORD,
        host: "/msns",
        "heart-beat": "0,0"
      };
      this.dynamicClient.connect(headers, this.onConnected, this.onFailed);
    },
    //验证用户
    verify,
    //回到顶部
    gotoTop() {
      scrollTo(0, 0);
    },
    //获取用户对某些动态是否点赞
    getLikeDynamic() {
      var dynamicIds = [];
      // console.log(this.dynamics);

      for (var i in this.dynamics) {
        // console.log(this.dynamics[i]);
        dynamicIds.push(this.dynamics[i].id);
      }
      // console.log(dynamicIds);

      this.$http({
        method: "get",
        url: "/like/queryIsLike",
        params: {
          likerId: this.$store.state.userInfo.uid,
          dynamicIds: dynamicIds
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false });
        }
      }).then(res => {
        // console.log(res);
        var likes = res.data;
        var dynamicIds = [];
        for (var i in likes) {
          dynamicIds.push(likes[i].dynamicId);
        }
        this.likeDynamicIds = dynamicIds;
        // console.log(this.dynamicIds);
      });
    },
    //获取用户是否关注此页的某些动态
    getFavorDynamic() {
      var dynamicIds = [];
      // console.log(this.dynamics);

      for (var i in this.dynamics) {
        // console.log(this.dynamics[i]);
        dynamicIds.push(this.dynamics[i].id);
      }
      // console.log(dynamicIds);

      this.$http({
        method: "get",
        url: "/favor/dynamic/queryIsFavor",
        params: {
          uid: this.$store.state.userInfo.uid,
          dynamicIds: dynamicIds
        },
        paramsSerializer: params => {
          return this.$qs.stringify(params, { indices: false });
        }
      }).then(res => {
        // console.log(res);
        var dynamicFavors = res.data;
        var dynamicIds = [];
        for (var i in dynamicFavors) {
          dynamicIds.push(dynamicFavors[i].dynamicId);
        }
        this.favorDynamicIds = dynamicIds;
      });
    }
  },
  //监听数据变化
  watch: {
    dynamicUpdate() {
      setTimeout(() => {
        this.searAllDynamic();
      }, 300);
    },
    currentPage() {
      this.searAllDynamic();
      this.gotoTop();
    },
    dynamics() {
      var dynamicContent = this.$refs.dynamicContent;
      // console.log(this.$refs);
      this.foldControl(dynamicContent);
    },
    "dynamicSearch.key"() {
      this.searAllDynamic();
      this.gotoTop();
    },
    "dynamicSearch.sortBy"() {
      this.searAllDynamic();
    },
    "dynamicSearch.desc"() {
      this.searAllDynamic();
    },
    "dynamicSearch.ids"() {
      this.searAllDynamic();
    },
    "dynamicSearch.uids"() {
      this.searAllDynamic();
    },
    "$store.state.dynamicPush"() {
      // console.log("dynamicPush");
      this.searAllDynamic();
    },

    verify
  },

  //钩子函数，在渲染页面前初始化
  created() {
    // this.$nextTick(() => {
    //   // this.searAllDynamic();
    // });
    //连接
    this.connect();
    //验证用户后调用父方法和获取用户收藏的音乐
    this.verify().then(() => {
      this.$emit("newsIsShow", this.show);
      this.getFavorMusicId();
    });
  },
  updated() {},
  //在渲染页面之后执行
  mounted() {
    //控制动态内容若过长则显示展开按钮
    this.show = true;
    let that = this;
    setTimeout(() => {
      // console.log(that.$refs);
      var refs = that.$refs;
      var dynamicContent = refs.dynamicContent;
      this.foldControl(dynamicContent);
      // console.log(dynamicContent);
    }, 300);
  }
};
</script>
<style scoped>
.text-content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.fold {
  -webkit-line-clamp: 5;
}
</style>
