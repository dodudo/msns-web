<template>
  <div>
    <!-- 小号左侧边栏，当页面缩小时可展开 -->
    <v-navigation-drawer
      v-if="userInfo.id != null"
      v-model="min_leftbar"
      height="630px"
      style="top:60px;z-index:999"
      fixed
      temporary
    >
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item @click="toPersonal()" link>
          <div>
            <v-icon class="mx-4">mdi-account</v-icon>
            <span>个人中心</span>
          </div>
        </v-list-item>
        <v-list-item @click="toMessage()" link>
          <div>
            <v-icon class="mx-4">mdi-message-text</v-icon>
            <span>消息</span>
          </div>
        </v-list-item>
        <v-list-item @click="toFavorr()" link>
          <div>
            <v-icon class="mx-4">mdi-heart</v-icon>
            <span>收藏</span>
          </div>
        </v-list-item>
        <v-list-item @click="toDynamic()" link>
          <div>
            <v-icon class="mx-4">mdi-heart</v-icon>
            <span>动态</span>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <!-- 顶部导航栏 -->
    <v-app-bar
      fixed
      dark
      prominenta
      color="red"
      src="https://picsum.photos/1920/1080?random"
      scroll-target
    >
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(255,0,0,1), rgba(255,0,0,0)"></v-img>
      </template>

      <a class="title" style="text-decoration: none;color:#fff" href="/index/main">
        <v-toolbar-title>Music Social Site</v-toolbar-title>
      </a>

      <v-app-bar-nav-icon v-show="!drawer" @click="min_leftbar = !min_leftbar" icon></v-app-bar-nav-icon>

      <v-row justify="center" align="center" class="mx-auto">
        <v-col align="center" class="pa-0" cols="6">
          <v-text-field label="您想搜什么" clearable class="mt-6" dense outlined v-model="search"></v-text-field>
        </v-col>
        <v-col class="pa-0" cols="1">
          <v-btn @click="toSearch()" link icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-btn v-show="drawer" @click="toIndex()" text large>首页</v-btn>
      <v-btn v-show="drawer" @click="toMusic()" text large>音乐</v-btn>
      <v-btn v-if="userInfo.id != null" v-show="drawer" @click="toDynamic()" text large>动态</v-btn>
      <v-btn v-if="userInfo.id != null" v-show="drawer" @click="toFavor()" text large>收藏</v-btn>
      <v-btn v-if="userInfo.id != null" v-show="drawer" @click="toMessage()" text large>
        <v-badge
          color="pink"
          :value="$store.state.unreadLikeCount+$store.state.unreadCommentCount"
          :content="$store.state.unreadLikeCount+$store.state.unreadCommentCount"
        >消息</v-badge>
      </v-btn>
      <span>
        <v-btn @click="userInfo.id == null ? alertToLogin() : toPersonal()" class="mx-3" text icon>
          <v-avatar style="position:relative" @mouseover="showCard()" @mouseleave="hideCard()">
            <img
              :src="
                userInfo.avatarUrl == null
                  ? require('../assets/default_avatar.jpg')
                  : userInfo.avatarUrl
              "
              alt="John"
            />
          </v-avatar>
        </v-btn>
        <v-card
          v-if="userInfo.id == null"
          light
          @mouseover="showCard"
          @mouseleave="hover = false"
          v-show="hover"
          width="200"
          style="text-align:center; position:absolute;top:70px;right:32px"
        >
          <v-list class="px-2">
            <v-list-item-group color="red">
              <v-list-item @click="toLogin()">
                <v-list-item-icon>
                  <v-icon>mdi-login-variant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>登录</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="toRegister()">
                <v-list-item-icon>
                  <v-icon>mdi-account-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>注册</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-card
          light
          v-if="userInfo.id != null"
          @mouseover="showCard"
          @mouseleave="hover = false"
          v-show="hover"
          width="300"
          style="text-align:center; position:absolute;top:70px;right:32px"
        >
          <v-avatar class="mt-6">
            <img :src="userInfo.avatarUrl" :alt="userInfo.uname" />
          </v-avatar>
          <div>{{ userInfo.uname }}</div>
          <v-row justify="center">
            <v-col
              :style="{ color: color1, cursor: pointer1 }"
              @mouseover="(color1 = 'red'), (pointer1 = 'pointer')"
              @mouseleave="color1 = ''"
              class="btn"
              cols="4"
              @click="toAttention()"
            >
              <div>关注</div>
              <div>{{ userCountInfo.favorCount }}</div>
            </v-col>
            <v-col
              :style="{ color: color2, cursor: pointer2 }"
              @mouseover="(color2 = 'red'), (pointer2 = 'pointer')"
              @mouseleave="color2 = ''"
              cols="4"
              @click="toMessage()"
            >
              <div>消息</div>
              <div>{{this.SMSCount}}</div>
            </v-col>
            <v-col
              :style="{ color: color3, cursor: pointer3 }"
              @mouseover="(color3 = 'red'), (pointer3 = 'pointer')"
              @mouseleave="color3 = ''"
              cols="4"
              @click="toPersonalDynamic()"
            >
              <div>动态</div>
              <div>{{ userCountInfo.dynamicCount }}</div>
            </v-col>
          </v-row>
          <v-list>
            <v-list-item-group color="red">
              <v-list-item @click="toPersonal()">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>个人中心</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click.stop="dialog = true">
                <v-list-item-icon>
                  <v-icon>mdi-exit-to-app</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>退出登录</v-list-item-title>
                </v-list-item-content>
                <v-dialog v-model="dialog" max-width="290">
                  <v-card>
                    <v-card-title class="headline">温馨提示</v-card-title>

                    <v-card-text>您确定要退出登录吗？</v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn color="green darken-1" text @click="dialog = false">抱歉，我点错了</v-btn>

                      <v-btn color="green darken-1" text @click="deleteCookie()">是的，我要退出</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </span>

      <v-btn
        class="ma-2"
        @click="userInfo.id == null ? alertToLogin() : focusInput()"
        depressed
        color="#D50000"
      >
        <v-icon left>mdi-pencil</v-icon>发表动态
      </v-btn>
    </v-app-bar>
    <div style="width:1520px"></div>
  </div>
</template>
<script>
import Stomp from "stompjs";
import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from "../mqtt";
import { verify } from "../verify";
export default {
  data() {
    return {
      loading: false,
      search: null,
      select: null,
      states: [], //自动补全联想,
      playStatus: "mdi-play",
      playBtnStatus: true,
      smsClient: Stomp.client(MQTT_SERVICE),
      hover: false,
      dialog: false,
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" }
      ],

      timeout: null,
      color1: "",
      color2: "",
      color3: "",
      pointer1: "",
      pointer2: "",
      pointer3: "",
      min_leftbar: false,
      userInfo: {},
      userCountInfo: {},
      SMSCount: 0
    };
  },
  created() {
    this.verify().then(() => {
      this.getSMSCount();
    });
    this.connect();
  },
  watch: {
    userInfo() {
      this.getUserCountInfo();
    },
    "$store.state.dynamicPush"() {
      this.getUserCountInfo();
    }
  },
  methods: {
    async getSMSCount() {
      var count = 0;
      await this.getUnreadCommentCount().then(res => {
        count += res;
      });
      await this.getUnreadLikeCount().then(res => {
        count += res;
        // console.log(count);
      });

      this.SMSCount = count;
      // console.log(this.SMSCount);
    },
    //查询未读评论数
    async getUnreadCommentCount() {
      var count = 0;
      await this.$http({
        method: "get",
        url: `/comment/countsByRespondentId/${this.$store.state.userInfo.uid}`
      }).then(res => {
        count += res.data;
        this.$store.dispatch("changeUnreadCommentCount", res.data);
      });
      // console.log(count);
      return count;
    },
    //查询未读点赞数
    async getUnreadLikeCount() {
      var count = 0;
      await this.$http({
        method: "get",
        url: `/like/countsByDynamicAuthorid/${this.$store.state.userInfo.uid}`
      }).then(res => {
        count += res.data;
        this.$store.dispatch("changeUnreadLikeCount", res.data);
      });
      return count;
    },
    //初始连接
    onConnected() {
      //订阅频道
      const topic = `/exchange/msns.sms.exchange/sms.${this.$store.state.userInfo.uid}`;
      this.smsClient.subscribe(topic, this.responseCallback, this.onFailed);
      // console.log(fram);
    },
    //当失败时
    onFailed(fram) {
      console.log(fram);
      // console.log(fram.code);
    },
    //当由数据响应时
    responseCallback(fram) {
      // this.dynamicUpdate = !this.dynamicUpdate;
      // alert("收到消息啦！" + fram.body);
      this.getSMSCount();
      console.log("返回用户id" + fram.body);
    },
    //连接rabbitmq
    connect() {
      const headers = {
        login: MQTT_USERNAME,
        passcode: MQTT_PASSWORD,
        host: "/msns",
        "heart-beat": "0,0"
      };
      this.smsClient.connect(headers, this.onConnected, this.onFailed);
    },
    getUserCountInfo() {
      this.$http({
        method: "get",
        url: `/search/user/userCountInfo/${this.userInfo.uid}`
      })
        .then(resp => {
          this.userCountInfo = resp.data;
          this.$store.dispatch("changeUserCountInfo", resp.data);
          // console.log(this.$store.state.userCountInfo);
          // console.log(this.userInfo);
        })
        .catch(() => {
          this.userCountInfo = {};
          this.$store.dispatch("changeUserCountInfo", this.userCountInfo);
        });
    },
    deleteCookie() {
      this.$http({
        method: "get",
        url: "/auth/deleteCookie"
      })
        .then(() => {
          this.dialog = false;
          location.reload();
        })
        .catch(() => {
          alert("退出失败！");
        });
    },
    verify,
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter(e => {
          return (e || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    searchEvent() {
      console.log(`搜索的值为：${this.search}`);
      this.$$emit("topBarSearchVal", this.search);
    },
    play() {
      this.playBtnStatus = !this.playBtnStatus;
      if (this.playBtnStatus == true) {
        this.playStatus = "mdi-play";
      } else {
        this.playStatus = "mdi-pause";
      }
      this.$store.dispatch("changePalyBtnStatus", this.playStatus);
    },
    showCard() {
      clearTimeout(this.timeout);
      this.hover = true;
    },
    hideCard() {
      this.timeout = setTimeout(() => {
        this.hover = false;
      }, 500);
    },
    toSearch() {
      this.$emit("topBarSearchVal", this.search);
    },
    toIndex() {
      this.$router.push({ path: "/index/main" });
    },
    toMusic() {
      this.$router.push({ path: "/index/music" });
    },
    toPersonal() {
      this.$router.push({ path: "/index/personal/info" });
    },
    toPersonalDynamic() {
      this.$router.push({ path: "/index/personal/dynamic" });
    },
    toDynamic() {
      this.$router.push({ path: "/index/dynamic" });
    },
    toFavor() {
      this.$router.push({ path: "/index/personal/favor" });
    },
    toMyMusic() {
      this.$router.push({ path: "/index/personal/music" });
    },
    toMessage() {
      this.$router.push({ path: "/index/message" });
    },
    toFan() {
      this.$router.push({ path: "/index/personal/fan" });
    },
    toAttention() {
      this.$router.push({ path: "/index/personal/attention" });
    },
    focusInput() {
      document.querySelector("#dynamic_textarea").focus();
    },
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    toRegister() {
      this.$router.push({ path: "/register" });
    },
    alertToLogin() {
      if (confirm("您还没有登录哦，现在要登陆吗？")) {
        this.$router.push({ path: "/login" });
      }
    }
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.dispatch("changeDrawer", val);
      }
    }
  }
};
</script>
