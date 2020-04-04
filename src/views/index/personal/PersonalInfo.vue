<template>
  <v-card class="mt-3 pa-2" width="1114">
    <v-form ref="avatar_form" v-model="avatarForm">
      <v-row align="center">
        <v-col align-self="center">
          <v-card flat height="40">
            <h4 class="ml-2" style="line-height:40px">我的头像</h4>
          </v-card>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="1">
          <v-avatar size="120">
            <img :src="user.avatarUrl" :alt="user.uname" />
          </v-avatar>
        </v-col>

        <v-col cols="1">
          <v-btn style="text-align:center;" dark fab class="ml-10" color="red">
            <span style="white-space:normal;width:45px">更换头像</span>
            <v-overlay z-index="1" opacity="0" absolute value="true">
              <input
                type="file"
                @change="fileChange"
                id="img_input"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                style="opacity: 0;height:45px;width:45px"
              />
            </v-overlay>
          </v-btn>
        </v-col>

        <v-col cols="1" class="ml-4" v-if="showChangeAvatar">
          <v-avatar size="80">
            <img :src="avatarUrl" :alt="user.uname" />
          </v-avatar>
        </v-col>
        <v-col v-if="showChangeAvatar" cols="1" class="ml-2">
          <v-btn fab small color="error" @click="uploadAvatar()">更换</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-form ref="info_form" v-model="validate1">
      <v-row align="center">
        <v-card class="ml-4 mr-2" flat height="40">
          <h4 style="line-height:40px">我的信息</h4>
        </v-card>

        <v-btn :color="edit ? 'error' : 'info'" @click="edit = !edit" small>{{
          edit ? "编辑" : "退出编辑"
        }}</v-btn>
      </v-row>
      <v-divider></v-divider>

      <v-row align="center">
        <v-col class="ml-6" style="text-align:right" cols="1">昵称:</v-col>
        <v-col cols="4">
          <v-text-field
            :disabled="edit"
            solo
            v-model="user.uname"
            flat
            :rules="nameRules"
            dense
            color="#EF5350"
            outlined
            label="昵称"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="ml-6" style="text-align:right" cols="1">UID:</v-col>
        <v-col cols="4">
          <v-text-field
            solo
            disabled
            hide-details
            flat
            dense
            color="#EF5350"
            v-model="user.uid"
            label="UID"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="ml-6" style="text-align:right" cols="1">我的签名:</v-col>
        <v-col cols="4">
          <v-text-field
            :disabled="edit"
            solo
            counter="50"
            flat
            v-model="user.description"
            dense
            maxlength="50"
            color="#EF5350"
            outlined
            label="签名"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="ml-6" style="text-align:right" cols="1">性别:</v-col>
        <v-col cols="4">
          <v-radio-group :disabled="edit" v-model="user.sex" row>
            <v-radio label="男" value="男"></v-radio>
            <v-radio label="女" value="女"></v-radio>
            <v-radio label="保密" value="保密"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col class="ml-6" style="text-align:right" cols="1">生日:</v-col>
        <v-col cols="4">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :disabled="edit"
                v-model="date"
                label="生日"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              ref="picker"
              v-model="date"
              :max="new Date().toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="text-center">
          <v-btn v-if="!edit" @click="uploadAvatar()">保存</v-btn>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-form>
    <v-row align="center">
      <v-col align-self="center">
        <v-card flat height="40">
          <h4 class="ml-2" style="line-height:40px">账号安全</h4>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="validate2">
      <v-row align="center">
        <v-col cols="1" class="ml-6 mb-6" style="text-align:right"
          >旧密码:</v-col
        >
        <v-col class="py-0" cols="4">
          <v-text-field
            solo
            outlined
            flat
            dense
            v-model="oldPassword"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[oldPasswordRules.min]"
            :type="show1 ? 'text' : 'password'"
            name="oldPassword"
            label="请输入旧密码"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="1" class="ml-6 mb-6" style="text-align:right"
          >新密码:</v-col
        >
        <v-col class="py-0" cols="4">
          <v-text-field
            solo
            outlined
            flat
            dense
            v-model="newPassword"
            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[newPasswordRules.min]"
            :type="show2 ? 'text' : 'password'"
            name="input-10-1"
            label="请输入新密码"
            counter
            @click:append="show2 = !show2"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="1" class="ml-6 mb-6 caption" style="text-align:right"
          >确认新密码:</v-col
        >
        <v-col class="py-0" cols="4">
          <v-text-field
            solo
            outlined
            flat
            dense
            v-model="reNewPassword"
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="reNewPasswordRules"
            :type="show3 ? 'text' : 'password'"
            name="input-10-1"
            label="请再次输入新密码"
            counter
            @keydown.native="testPassword()"
            @keyup.native="testPassword()"
            @blur="testPassword()"
            @click:append="show3 = !show3"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="7">
          <v-btn color="red" :disabled="!valid" width="80" @click="submit()"
            >保存</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
<script>
import { formatDate } from "../../../assets/formatDate";
export default {
  data: () => ({
    validate1: true,
    validate2: true,
    date: null,
    menu: false,
    show1: false,
    show2: false,
    show3: false,
    avatarForm: null,
    showChangeAvatar: false,
    edit: true,
    oldPassword: "",
    newPassword: "",
    avatarFile: null,
    reNewPassword: "",
    btnStatus: false,
    avatarUrl: "",
    reNewpasswordErr: [],
    nameRules: [
      v => !!v || "Name is required",
      v => /^[a-zA-Z]{4,10}$/.test(v) || "只能输入4-10个以字母开头的字串"
    ],
    descRules: { min: v => v.length <= 50 || "输入长度不能超过50" },
    oldPasswordRules: {
      min: v => v.length >= 6 || "密码最少6位"
    },
    newPasswordRules: { min: v => v.length >= 6 || "密码最少6位" },
    reNewPasswordRules: [],
    valid: true,
    user: {}
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.$http({
        method: "get",
        url: "/auth/getUser"
      })
        .then(resp => {
          this.user = resp.data;
          console.log(this.user.birthday);

          this.date = this.formatDate(this.user.birthday);
          // console.log(birth);
          this.$store.dispatch("changeUser", this.user);
          // console.log(this.user);
        })
        .catch(() => {
          this.user = {};
          this.$store.dispatch("changeUser", this.user);
        });
    },
    save(date) {
      this.$refs.menu.save(date);
    },
    testPassword() {
      if (this.reNewPassword == "") {
        this.reNewPasswordRules = ["长度不能为0"];
      } else {
        if (!/^(\w){6,20}$/.test(this.reNewPassword)) {
          this.reNewPasswordRules = ["只能输入6-20个字母、数字、下划线"];
        } else if (this.newPassword != this.reNewPassword) {
          this.reNewPasswordRules = ["密码不一致"];
        } else {
          this.reNewPasswordRules = [true];
        }
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        if (this.$refs.info_form.validate()) {
          this.snackbar = true;
          this.$http({
            method: "get",
            url: `/auth/changePwd`,
            params: {
              upassword: this.oldPassword,
              newPassword: this.newPassword
            },
            paramsSerializer: params => {
              return this.$qs.stringify(params, { indices: false });
            }
          })
            .then(() => {
              alert("保存成功!");
            })
            .catch(() => {
              alert("保存失败");
            });
        }
      }
    },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    fileChange(e) {
      var img_input = document.querySelector("#img_input");

      var files = e.target.files || e.dataTransfer.files;

      if (!files.length) return;
      this.avatarFile = files[0];
      // var iamge = new Image();
      var that = this;
      for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = function(e) {
          that.avatarUrl = e.target.result;
          that.showChangeAvatar = true;
          console.log(that.avatarUrl);
        };
      }
      img_input.value = null;
    },
    changeUserInfo() {
      if (this.$refs.info_form.validate()) {
        this.snackbar = true;
        this.$http({
          method: "put",
          url: `/user`,
          data: this.user
        })
          .then(() => {
            alert("保存成功!");
          })
          .catch(() => {
            alert("保存失败");
          });
      }
    },
    async uploadAvatar() {
      var formData = new FormData();
      // console.log(this.avatarFile);

      formData.append("file", this.avatarFile);

      await this.$http({
        method: "post",
        url: "http://localhost:10000/upload/image",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(resp => {
        this.avatarUrl = resp.data;
        this.changeAvatar();
      });
    },
    async changeAvatar() {
      await this.$http({
        method: "get",
        url: "/user/changeAvatar",
        params: { avatarUrl: this.avatarUrl, id: this.user.id }
      })
        .then(() => {
          // console.log("change");
          this.$store.state.user.avatarUrl = this.avatarUrl;
          this.$store.state.userInfo.avatarUrl = this.avatarUrl;
          alert("修改成功！");
          this.showChangeAvatar = false;
        })
        .catch(() => {
          alert("修改失败！");
        });
    }
  }
};
</script>
