<template>
  <v-card class="ml-2" style="margin-top:78px" flat width="1114">
    <v-carousel cycle height="200" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item
        :src="require(`../../assets/${slide.img}`)"
        v-for="(slide, i) in sliders"
        :key="i"
      >
        <v-sheet color="rgba(0,0,0,0)" height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">{{ slide.name }}</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <v-tabs v-model="tab" light class="elevation-2" dark>
      <v-tabs-slider></v-tabs-slider>

      <v-tab v-for="i in classItems" :key="i">{{ i }}</v-tab>
      <v-spacer></v-spacer>
      <v-card width="300" class="d-flex align-center">
        <v-text-field
          background-color="rgba(255,255,255,.4)"
          class="d-flex md-3"
          dense
          hide-details
          label="搜索音乐"
          v-model="pageRequest.key"
          solo
          dark
        ></v-text-field>
        <v-btn @click="getMusics()" dark class="mt-1 d-flex md-1" icon>
          <v-icon dark>mdi-magnify</v-icon>
        </v-btn>
      </v-card>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="i in classItems" :key="i">
        <v-card flat max-height="380" style="overflow-y:auto">
          <v-card flat class="mx-auto pa-0" width="700" v-show="musicItems[0]==undefined">
            <v-card-text style="text-align:center">没有音乐呢</v-card-text>
          </v-card>
          <v-list class="pa-0 ma-0" dense two-line>
            <template v-for="(item, index) in musicItems">
              <v-divider v-if="index!=0 && index!=musicItems.length" :key="index" inset></v-divider>

              <v-list-item @click="playMusic(item)" dense :key="item.id" link>
                <v-list-item-avatar style="border-radius:4px" tile class="my-0">
                  <v-img :src="item.musicCoverUrl"></v-img>
                </v-list-item-avatar>
                <v-list-item-content style="height:40px" class="pa-0 mr-12">
                  <v-list-item-title v-html="item.musicName"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content style="height:40px" class="pa-0">
                  <v-list-item-subtitle v-html="item.musicLength"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content style="height:40px" class="pa-0">
                  <v-list-item-title v-html="item.musicAuthor"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content style="height:40px" class="pa-0">
                  <v-list-item-subtitle v-html="item.musicAlbum"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn @click.stop="favor(index)" icon>
                    <v-icon :color="item.favor ? 'red' : 'gray'">mdi-heart</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
        <div v-if="totalPage != 0" class="text-center">
          <v-pagination v-model="currentPage" :length="totalPage" :total-visible="7"></v-pagination>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import { verify } from "../../verify";
export default {
  data: () => ({
    tab: null,
    sliders: [
      { name: "Pop", img: "pop.jpg" },
      { name: "Rock", img: "rock.jpg" },
      { name: "Folk", img: "folk.jpg" },
      { name: "Electronic", img: "dj.jpeg" },
      { name: "Light", img: "gq.jpg" },
      { name: "ACG", img: "acg.jpg" }
    ],
    classItems: ["热歌榜", "流行", "摇滚", "民谣", "电子", "轻音乐", "ACG"],
    musicItems: {},
    pageRequest: {
      key: "",
      page: 1,
      sortBy: "musicPushDate",
      desc: true,
      size: 5,
      uids: [],
      typeId: null
    },
    totalPage: 0,
    currentPage: 1,
    favorMusicIds: [],
    favorState: false
  }),
  created() {
    // console.log("hhh");

    this.verify().then(() => {
      this.getFavorMusicId().then(() => {
        this.getMusics();
      });
    });
  },
  watch: {
    currentPage() {
      // console.log(this.favorMusicIds);

      this.getMusics();
    },
    tab() {
      this.getMusics();
    }
  },
  methods: {
    verify,
    favor(index) {
      if (this.musicItems[index].favor == true) {
        if (
          confirm(`您确定要取消收藏${this.musicItems[index].musicName}吗？`)
        ) {
          this.musicItems[index].favor = false;
          this.$http({
            method: "delete",
            url: `/favor/music/`,
            params: {
              collectorId: this.$store.state.userInfo.uid,
              musicId: this.musicItems[index].id
            },
            paramsSerializer: params => {
              return this.$qs.stringify(params, { indices: false });
            }
          })
            .then(() => {
              this.getFavorMusicId();
              alert("取消收藏成功!");
            })
            .catch(() => {
              alert("取消收藏失败！");
            });
        }
      } else {
        this.musicItems[index].favor = true;
        this.$http({
          method: "post",
          url: `/favor/music`,
          params: {
            collectorId: this.$store.state.userInfo.uid,
            musicId: this.musicItems[index].id
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, { indices: false });
          }
        })
          .then(() => {
            this.getFavorMusicId();
            alert("收藏成功!");
          })
          .catch(() => {
            alert("收藏失败！");
          });
      }
      let obj = Object.assign({}, this.musicItems[index]);
      this.$set(this.musicItems, index, obj);
      this.favorState = !this.$store.state.favorState;
      this.$store.dispatch("changeFavorState", this.favorState);
    },
    playMusic(item) {
      this.$store.dispatch("changeMusic", item);
      this.$store.dispatch("changeMusicIndex", -1);
    },
    async getMusics() {
      this.pageRequest.typeId = this.tab;
      if (this.tab == 0) {
        this.pageRequest.typeId = null;
      }
      this.pageRequest.page = this.currentPage;
      // console.log(this.dynamicSearch);

      await this.$http({
        method: "post",
        url: "/search/music/page",
        data: this.pageRequest
      }).then(resp => {
        this.musicItems = resp.data.items;
        this.totalPage = resp.data.totalPage;
        for (var i in this.musicItems) {
          this.musicItems[i].favor = false;
          if (this.favorMusicIds.indexOf(this.musicItems[i].id) != -1) {
            this.musicItems[i].favor = true;
            let obj = Object.assign({}, this.musicItems[i]);
            this.$set(this.musicItems, i, obj);
          }
        }
        this.musicItems = Object.assign({}, this.musicItems);
        // console.log(this.dynamics[0]);
      });
    },
    async getFavorMusicId() {
      await this.$http({
        method: "get",
        url: `/favor/music/queryByUid/${this.$store.state.userInfo.uid}`
      }).then(resp => {
        // console.log("jhj");
        this.favorMusicIds = resp.data;
      });
    }
  }
};
</script>
