<template>
  <v-card class="mb-0" flat>
    <div style="width:380px"></div>
    <v-navigation-drawer
      v-model="rdrawer"
      height="630"
      width="380"
      right
      fixed
      class="right-sidebar"
      light
      stateless
      floating
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">我的音乐</v-list-item-title>
          <v-list-item-subtitle>{{$store.state.userInfo.uname}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-content>
        <v-container fluid>
          <v-row justify="center" no-gutters>
            <v-col cols="7">
              <v-img
                :src="$store.state.music.musicCoverUrl == null ? (musicItems[0].musicCoverUrl == null ? 'https://picsum.photos/510/300?random' : musicItems[0].musicCoverUrl ) : $store.state.music.musicCoverUrl"
                height="210"
                width="210"
                aspect-ratio="1"
              ></v-img>
            </v-col>
          </v-row>
          <v-row justify="center" style="height:50px" no-gutters>
            <v-col cols="4">
              <v-list class="pa-0">
                <v-list-item style="text-align:center" two-line>
                  <v-list-item-content class="pa-0">
                    <v-list-item-title>{{$store.state.music.musicName == null ? musicItems[0].musicName : $store.state.music.musicName}}</v-list-item-title>
                    <v-list-item-subtitle>{{$store.state.music.musicAuthor == null ? musicItems[0].musicAuthor : $store.state.music.musicAuthor}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="2" style="text-align:right">
              <div class="overline mt-2">{{realFormatSecond(audio.currentTime)}}</div>
            </v-col>
            <v-col cols="8">
              <v-slider
                v-model="sliderTime"
                dense
                hide-details
                @change="changeCurrentTime"
                class="ma-0 pa-0"
                color="orange darken-3"
              ></v-slider>
            </v-col>
            <v-col cols="2">
              <div class="overline mt-2">{{realFormatSecond(audio.maxTime)}}</div>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col class="pa-0" style="text-align:center" cols="2"></v-col>
            <v-col class="pa-0" style="text-align:center" cols="2">
              <v-btn @click="preOrNext(false)" icon>
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>
            </v-col>
            <v-col class="pa-0" style="text-align:center" cols="2">
              <v-btn icon @click="audio.playing ? pause() : play()">
                <v-icon>{{ this.$store.state.playing ? "mdi-pause" : "mdi-play" }}</v-icon>
              </v-btn>
            </v-col>
            <v-col class="pa-0" style="text-align:center" cols="2">
              <v-btn @click="preOrNext(true)" icon class="mr-2">
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>
            </v-col>
            <v-col class="pa-0" style="text-align:center" cols="2">
              <v-btn @click.stop="favor($store.state.music)" icon>
                <v-icon :color="$store.state.music.favor ? 'red' : 'gray'">mdi-heart</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-subheader style="height:20px">歌曲列表</v-subheader>
            <v-card flat style="overflow-y:auto" width="360" height="186">
              <v-list class="pa-0 ma-0" dense two-line>
                <template v-for="(item, index) in musicItems">
                  <v-divider v-if="index!=0 && index!=musicItems.length" :key="index" inset></v-divider>

                  <v-list-item @click="initialMusic(item,index)" link dense :key="item.id">
                    <v-list-item-avatar style="border-radius:4px" tile class="my-0">
                      <v-img :src="item.musicCoverUrl"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content style="height:40px" class="pa-0">
                      <v-list-item-title v-html="item.musicName"></v-list-item-title>
                      <v-list-item-subtitle v-html="item.musicAuthor"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <div v-if="totalPage != 0" class="text-center">
                  <v-pagination circle v-model="currentPage" :length="totalPage" :total-visible="7"></v-pagination>
                </div>
              </v-list>
            </v-card>
          </v-row>
        </v-container>
      </v-content>
    </v-navigation-drawer>
    <audio
      ref="audio"
      @pause="onPause()"
      @play="onPlay()"
      @ended="onEnded()"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      :src="this.$store.state.music.musicUrl == null ? audioSrc : this.$store.state.music.musicUrl"
      v-show="false"
      controls="controls"
    ></audio>
  </v-card>
</template>
<script>
import { verify } from "../verify";
export default {
  data: () => ({
    items: [
      { title: "Home", icon: "mdi-home-city" },
      { title: "My Account", icon: "mdi-account" },
      { title: "Users", icon: "mdi-account-group-outline" }
    ],
    musicItems: {
      0: {}
    },
    screenWidth: "",
    playStatus: "mdi-play",
    drawer: true,
    pageRequest: {
      key: "",
      page: 1,
      sortBy: "musicPushDate",
      desc: true,
      size: 10,
      uids: []
    },
    totalPage: 0,
    currentPage: 1,
    favorState: 0,
    audioSrc: "",
    audio: {
      playing: false,
      // 音频当前播放时长
      currentTime: 0,
      // 音频最大播放时长
      maxTime: 0
    },
    sliderTime: null
  }),
  created() {
    this.verify().then(() => {
      this.getMusics();
    });
  },
  watch: {
    currentPage() {
      this.getMusics();
    },
    "$store.state.favorState"() {
      setTimeout(() => {
        this.getMusics();
      }, 100);
    },
    "$store.state.music"() {
      setTimeout(() => {
        this.playMusic();
      }, 100);
    }
  },
  methods: {
    verify,
    // play() {
    //   this.playBtnStatus = !this.playBtnStatus;
    //   if (this.playBtnStatus == true) {
    //     this.playStatus = "mdi-play";
    //   } else {
    //     this.playStatus = "mdi-pause";
    //   }
    //   this.$store.dispatch("changePalyBtnStatus", this.playStatus);
    // },
    initialMusic(music, musicIndex) {
      // console.log(musicIndex);
      music = Object.assign({}, music);

      this.$store.dispatch("changeMusic", music);
      this.$store.dispatch("changeMusicIndex", musicIndex);
    },
    playMusic() {
      return this.play();
    },
    preOrNext(isNext) {
      // console.log("newxt");
      let index = this.$store.state.musicIndex;
      if (isNext) {
        index++;
      } else {
        index--;
      }
      if (index < 0) {
        index = 0;
      }

      if (index >= Object.keys(this.musicItems).length) {
        index = Object.keys(this.musicItems).length - 1;
      }
      this.$store.dispatch("changeMusic", this.musicItems[index]);
      this.$store.dispatch("changeMusicIndex", index);
      this.initialMusic(this.$store.state.music, this.$store.state.musicIndex);
    },
    //播放
    play() {
      this.$refs.audio.play();
    },
    //暂停
    pause() {
      this.$refs.audio.pause();
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true;
      this.$store.dispatch("changePlaying", this.audio.playing);
    },
    onPause() {
      this.audio.playing = false;
      this.$store.dispatch("changePlaying", this.audio.playing);
    },
    //当音乐结束时自动播放下一首
    onEnded() {
      this.preOrNext(true);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.maxTime = parseInt(res.target.duration);
    },
    changeCurrentTime() {
      this.$refs.audio.currentTime = parseInt(
        (this.sliderTime / 100) * this.audio.maxTime
      );
    },
    realFormatSecond(second) {
      var secondType = typeof second;

      if (secondType === "number" || secondType === "string") {
        second = parseInt(second);

        var hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        var mimute = Math.floor(second / 60);
        second = second - mimute * 60;

        return (
          hours +
          ":" +
          ("0" + mimute).slice(-2) +
          ":" +
          ("0" + second).slice(-2)
        );
      } else {
        return "0:00:00";
      }
    },
    getMusics() {
      // console.log(this.$store.state.userInfo.uid);
      if (this.$store.state.userInfo.uid == null) return;
      this.pageRequest.page = this.currentPage;

      // console.log(this.dynamicSearch);
      this.pageRequest.uids = [this.$store.state.userInfo.uid];
      this.$http({
        method: "post",
        url: "/search/music/page",
        data: this.pageRequest
      }).then(resp => {
        this.musicItems = resp.data.items;
        this.totalPage = resp.data.totalPage;

        for (let i = 0; i < this.musicItems.length; i++) {
          this.musicItems[i].favor = true;
        }
        this.musicItems = Object.assign({}, this.musicItems);
        this.audioSrc = this.musicItems[0].musicUrl;
        // console.log(this.dynamics[0]);
      });
    },
    favor(music) {
      if (music.favor == true) {
        if (confirm(`您确定要取消收藏${music.musicName}吗？`)) {
          music.favor = false;
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
              alert("取消收藏成功!");
            })
            .catch(() => {
              alert("取消收藏失败！");
            });
        }
      } else {
        music.favor = true;
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
            alert("收藏成功!");
          })
          .catch(() => {
            alert("收藏失败！");
          });
      }

      this.favorState = !this.$store.state.favorState;
      this.$store.dispatch("changeFavorState", this.favorState);
    }
  },
  computed: {
    rdrawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.dispatch("changeDrawer", val);
      }
    }
  },
  components: {},
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        if (this.screenWidth < 1500) {
          this.drawer = false;
        } else {
          this.drawer = true;
        }
      })();
    };
  }
};
</script>
<style scoped>
.right-sidebar {
  margin-top: 78px;
  margin-right: 8px;
  z-index: 1;
  box-shadow: 0px 0px 7px rgba(224, 139, 139, 0.4);
}
</style>
