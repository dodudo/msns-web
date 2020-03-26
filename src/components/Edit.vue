<template>
  <v-card
    width="700"
    v-ripple="false"
    class="mx-auto mb-4 pa-2"
    style="margin-top: 78px;box-shadow:1px 4px 7px rgba(255,0,0,.3)"
  >
    <v-form ref="dynamic_form" v-model="valid">
      <v-row class="ma-0">
        <v-col class="pb-0" cols="12">
          <v-card flat>
            <v-textarea
              clearable
              clear-icon="mdi-close-circle-outline"
              label="有什么想和大家分享的"
              class
              :rules="contenRule"
              id="dynamic_textarea"
              v-model.trim="dynamic_text"
              :value="dynamic_text"
              color="#EF9A9A"
              outlined
              flat
              solo
              :hide-details="valid"
              rows="2"
            ></v-textarea>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="ma-0" align="center">
        <v-col cols="1" class="py-0 px-1">
          <v-btn @click="showEmoji()" small fab text style="font-size:20px;">😀</v-btn>
        </v-col>
        <v-col cols="1" class="py-0 px-1">
          <v-btn @click="showImg()" small fab text style="font-size:20px;">🖼️</v-btn>
        </v-col>
        <v-col cols="1" class="py-0 px-1">
          <v-btn @click="openDialog()" small fab text style="font-size:20px;">🎵</v-btn>
        </v-col>
        <v-col class="pa-0">
          <v-card flat>
            <v-chip
              v-if="chip"
              class="ma-2"
              close
              color="red"
              text-color="white"
              @click:close="delMusic()"
            >
              <v-icon left>mdi-music-note-eighth</v-icon>
              {{selectedMusic.musicName}} - {{selectedMusic.musicAuthor}}
            </v-chip>
          </v-card>
        </v-col>
        <v-col cols="1" class="d-flex justify-end py-0 pr-4">
          <v-btn small color="red" @click="publish()" dark style="font-size:14px;">发布</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row id="inputPanel" class="ma-0 mt-1">
      <!-- 表情输入框 -->
      <v-card id="emoji_card " v-if="show_emoji" height="100" style="overflow-y:auto" class="mx-1">
        <v-btn
          v-for="(emoji, index) in emojis"
          :key="index"
          small
          fab
          text
          @click="addEmoji(index)"
          style="font-size:20px;"
        >{{ emoji }}</v-btn>
      </v-card>
      <!-- 图片上传框 -->
      <v-card
        v-if="show_img"
        class="d-flex align-center justify-start mx-1 px-2"
        width="700"
        height="100"
      >
        <v-hover v-slot:default="{ hover }" v-for="(imgUrl, index) in imgUrls" :key="index">
          <v-card class="mr-1" height="80" width="80px">
            <v-img aspect-ratio="1" max-width="80" max-height="80" :src="imgUrl"></v-img>

            <v-overlay
              v-if="hover"
              z-index="1"
              class="d-felx justify-end align-start"
              opacity="0"
              absolute
              value="true"
            >
              <v-btn height="24" @click="delImg(index)" width="24" class="del-img" icon>
                <v-icon color="#000">mdi-close-box</v-icon>
              </v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
        <v-card
          v-if="show_img_input"
          class="d-flex align-center justify-center"
          height="80"
          width="80"
        >
          <v-icon>mdi-image-plus</v-icon>

          <v-overlay z-index="1" opacity="0" absolute value="true">
            <input
              type="file"
              @change="fileChange"
              id="img_input"
              accept="image/png, image/jpeg, image/gif, image/jpg"
              style="opacity: 0;height:80px;width:80px"
            />
          </v-overlay>
        </v-card>
      </v-card>
      <!-- 音乐选择输入框 -->

      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>选择音乐</v-card-title>
            <v-row>
              <v-col cols="8" class="ml-3">
                <v-text-field
                  background-color="rgba(255,255,255,.4)"
                  dense
                  hide-details
                  label="搜索音乐"
                  v-model="pageRequest.key"
                ></v-text-field>
              </v-col>
              <v-col class="px-0" cols="1">
                <v-btn @click="getMusics()" icon>
                  <v-icon dark>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-card flat style="overflow-y:auto" height="500">
              <v-list class="pa-0 ma-0" dense two-line>
                <template v-for="(item, index) in musicItems">
                  <v-divider v-if="index!=0 && index!=musicItems.length" :key="index" inset></v-divider>

                  <v-list-item @click="selectMusic(item)" link dense :key="item.id">
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
          </v-card>
        </v-dialog>
      </div>
    </v-row>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "😳",
      "😦",
      "😰",
      "😥",
      "😭",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "😘",
      "😗",
      "😚",
      "😋",
      "😛",
      "😜",
      "🤪",
      "😝",
      "🤗",
      "🤐",
      "🤨",
      "😐",
      "😑",
      "😶",
      "😏",
      "😒",
      "🙄",
      "😬",
      "🤥",
      "😌",
      "😴",
      "😪",
      "😷",
      "🤒",
      "🤢",
      "🤮",
      "🤧",
      "🥵",
      "🥶",
      "😎",
      "😕",
      "😟",
      "🙁",
      "😮",
      "😱",
      "😖",
      "😓",
      "😡",
      "😠",
      "😈",
      "👿",
      "💗",
      "❤",
      "👌",
      "🤏",
      "✌",
      "🤞"
    ],
    show_emoji: false,
    show_img: false,
    show_music: false,
    show_img_input: true,
    dynamic_text: "",
    img_rules: [
      value =>
        !value ||
        value.size < 2000000 ||
        "Avatar size should be less than 2 MB!"
    ],
    imgUrls: [],
    musicItems: {
      0: {}
    },
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
    dialog: false,
    selectedMusic: {},
    chip: false,
    contenRule: [],
    dynamic: {},
    imgFiles: [],
    imgUrlsStr: ""
  }),
  watch: {
    currentPage() {
      this.getMusics();
    }
  },
  methods: {
    showEmoji() {
      if (this.show_emoji == false) {
        this.show_emoji = true;
        this.show_img = false;
        this.show_music = false;
      } else {
        this.show_emoji = false;
        var dt = document.querySelector("#dynamic_textarea");
        var that = this;
        dt.removeEventListener("blur", that.text_blur, false);
      }
    },
    showImg() {
      if (this.show_img == false) {
        this.show_emoji = false;
        this.show_img = true;
        this.show_music = false;
      } else {
        this.show_img = false;
      }
    },
    showMusic() {
      if (this.show_music == false) {
        this.show_emoji = false;
        this.show_img = false;
        this.show_music = true;
      } else {
        this.show_music = false;
      }
    },
    addEmoji(i) {
      var dt = document.querySelector("#dynamic_textarea");
      var startPos = dt.selectionStart;
      var endPos = dt.selectionEnd;
      if (startPos === undefined || endPos === undefined) return;
      var txt = dt.value;
      var result =
        txt.substring(0, startPos) + this.emojis[i] + txt.substring(endPos);
      dt.value = result;
      var that = this;
      dt.addEventListener("blur", that.text_blur, false);
      dt.focus();
      dt.selectionStart = startPos + this.emojis[i].length;
      dt.selectionEnd = startPos + this.emojis[i].length;
      this.dynamic_text = result;
    },
    text_blur(e) {
      e.preventDefault();
      var dt = document.querySelector("#dynamic_textarea");
      dt.focus();
    },
    fileChange(e) {
      var img_input = document.querySelector("#img_input");

      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      // var iamge = new Image();
      var that = this;
      for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(files[i]);
        // console.log(files[i]);
        this.imgFiles.push(files[i]);
        reader.onload = function(e) {
          if (that.imgUrls.length <= 6) {
            that.imgUrls.push(e.target.result);
            that.show_img_input = true;
            if (that.imgUrls.length == 6) {
              that.show_img_input = false;
            }
          } else {
            that.show_img_input = false;
          }
        };
      }
      img_input.value = null;
    },
    delImg(i) {
      this.imgUrls.splice(i, 1);
      this.imgFiles.splice(i, 1);
    },
    getMusics() {
      // console.log(this.$store.state.userInfo.uid);
      this.pageRequest.page = this.currentPage;
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
    selectMusic(music) {
      this.selectedMusic = music;
      this.dialog = false;
      this.chip = true;
    },
    delMusic() {
      this.selectedMusic = {};
      this.chip = false;
    },
    openDialog() {
      this.getMusics();
      this.dialog = true;
    },
    /**
     * 发表动态
     */
    publish() {
      if (this.dynamic_text == null || this.dynamic_text == "") {
        this.contenRule = [v => !!v || "内容不能为空！"];
      } else {
        this.contenRule = [true];
      }
      if (this.$refs.dynamic_form.validate()) {
        // console.log("hhh");
        if (this.imgFiles.length <= 0) {
          this.addDynamic();
        } else {
          this.uploadImgs().then(() => {
            this.addDynamic();
          });
        }
      }
    },
    /**
     * 发送新增动态请求
     */
    async addDynamic() {
      if (
        this.$store.state.userInfo.uid == null ||
        this.$store.state.userInfo.uid == undefined
      ) {
        return;
      }
      this.dynamic.uid = this.$store.state.userInfo.uid;
      this.dynamic.dynamicContent = this.dynamic_text;
      this.dynamic.imgUrls = this.imgUrlsStr;
      this.dynamic.dynamicTypeId = 1;
      if (this.selectedMusic == {}) {
        this.dynamic.musicId = null;
      } else {
        this.dynamic.musicId = this.selectedMusic.musicId;
      }

      const dynamicObj = Object.assign({}, this.dynamic);
      // console.log(dynamicObj);
      await this.$http({
        method: "post",
        url: "/dynamic",
        data: dynamicObj
      })
        .then(() => {
          alert("发布成功!");
          this.selectedMusic = {};
          this.dynamic_text = "";
          this.imgUrlsStr = "";
          this.imgUrls = [];
          this.imgFiles = [];
          this.dynamic = {};
          this.chip = false;
          this.$store.dispatch(
            "changeDynamicPush",
            !this.$store.state.dynamicPush
          );
        })
        .catch(err => {
          alert("发布失败:" + err.response.data);
        });
    },
    /**
     * 上传图片
     */
    async uploadImgs() {
      var formData = new FormData();
      // console.log(this.avatarFile);
      for (let i = 0; i < this.imgFiles.length; i++) {
        formData.append("file", this.imgFiles[i]);
      }
      await this.$http({
        method: "post",
        url: "http://localhost:10000/upload/image",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(resp => {
        console.log(resp);
        this.imgUrlsStr = resp.data;
      });
    }
  }
};
</script>
