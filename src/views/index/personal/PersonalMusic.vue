<template>
  <v-card width="1112" class="mt-2">
    <v-card class="mx-2" height="54">
      <v-list-item style="height:54px" dens>
        <v-list-item-avatar
          style="border-radius:4px"
          tile
          class="my-0"
        ></v-list-item-avatar>
        <v-list-item-content style="height:40px" class="pa-0 mr-12">
          <v-list-item-title>歌曲名</v-list-item-title>
        </v-list-item-content>
        <v-list-item-content style="height:40px" class="pa-0">
          <v-list-item-title>时长</v-list-item-title>
        </v-list-item-content>
        <v-list-item-content style="height:40px" class="pa-0">
          <v-list-item-title>歌手名</v-list-item-title>
        </v-list-item-content>
        <v-list-item-content style="height:40px" class="pa-0">
          <v-list-item-title>专辑</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action style="height:40px" class="pa-0">
          <v-list-item-title>收藏</v-list-item-title>
        </v-list-item-action>
      </v-list-item>
    </v-card>

    <v-card height style="overflow-y:auto" flat class="mt-2 pa-2">
      <v-card
        flat
        class="mx-auto pa-0"
        width="700"
        v-show="musicItems[0] == undefined"
      >
        <v-card-text style="text-align:center">没有音乐呢</v-card-text>
      </v-card>
      <v-list class="pa-0 ma-0" dense two-line>
        <template v-for="(item, index) in musicItems">
          <v-divider
            v-if="index != 0 && index != musicItems.length"
            :key="index"
            inset
          ></v-divider>

          <v-list-item
            @click="playMusic(item, index)"
            dense
            :key="item.id"
            link
          >
            <v-list-item-avatar style="border-radius:4px" tile class="my-0">
              <v-img :src="item.musicCoverUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-content style="height:40px" class="pa-0 mr-12">
              <v-list-item-title v-html="item.musicName"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-content style="height:40px" class="pa-0">
              <v-list-item-subtitle
                v-html="item.musicLength"
              ></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-content style="height:40px" class="pa-0">
              <v-list-item-title v-html="item.musicAuthor"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-content style="height:40px" class="pa-0">
              <v-list-item-subtitle
                v-html="item.musicAlbum"
              ></v-list-item-subtitle>
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
      <v-pagination
        v-model="currentPage"
        :length="totalPage"
        :total-visible="7"
      ></v-pagination>
    </div>
  </v-card>
</template>
<script>
import { verify } from "../../../verify";
export default {
  data: () => ({
    musicItems: {},
    i: [],
    pageRequest: {
      key: "",
      page: 1,
      sortBy: "musicPushDate",
      desc: true,
      size: 6,
      uids: []
    },
    totalPage: 0,
    currentPage: 1,
    favorState: false
  }),
  created() {
    this.verify().then(() => {
      this.getMusics();
    });
  },
  watch: {
    currentPage() {
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
    playMusic(item, index) {
      this.$store.dispatch("changeMusic", item);
      this.$store.dispatch("changeMusicIndex", index);
    },
    getMusics() {
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
        // console.log(this.dynamics[0]);
      });
    }
  }
};
</script>
