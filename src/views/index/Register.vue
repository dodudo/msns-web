<template>
  <v-app>
    <v-card height="100vh" flat :img="require('../../assets/rbg.jpg')">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card color="rgba(255,255,255,.7)" class="elevation-12">
              <v-toolbar dark color="#761705">
                <v-toolbar-title>欢迎注册</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="user.uname"
                    :counter="10"
                    :rules="nameRules"
                    label="用户名"
                    required
                  ></v-text-field>
                  <v-text-field
                    ref="email"
                    v-model="user.email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.upassword"
                    :rules="passwordRules"
                    label="密码"
                    required
                  ></v-text-field>
                  <v-text-field
                    @keydown.native="testPassword()"
                    @keyup.native="testPassword()"
                    @blur="testPassword()"
                    v-model="repassword"
                    :rules="repasswordRules"
                    label="确认密码"
                    required
                  ></v-text-field>
                  <div>
                    <v-text-field
                      class="d-inline-flex"
                      v-model="checkCode"
                      :rules="checkCodeRules"
                      label="验证码"
                      required
                    ></v-text-field>
                    <v-btn
                      class="ml-6 caption"
                      color="#b73f0d"
                      :disabled="isClick"
                      @click="sendMsg"
                      >{{ getCodeText }}</v-btn
                    >
                  </div>
                  <div class="mx-auto">
                    <v-btn :disabled="!valid" color="#b73f0d" @click="validate"
                      >注册</v-btn
                    >
                    <v-btn class="ma-2" color="#b73f0d" @click="toLogin"
                      >已账号？去登录</v-btn
                    >
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    user: {},
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "Name is required",
      v => /^[a-zA-Z]{4,10}$/.test(v) || "只能输入4-10个以字母开头的字串"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(v) || "E-mail输入错误"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => /^(\w){6,20}$/.test(v) || "只能输入6-20个字母、数字、下划线"
    ],
    repassword: "",
    repasswordRules: [],
    checkCode: "",
    checkCodeRules: [
      v => !!v || "check code is required",
      v => /^[0-9]{6}$/.test(v) || "只能输入6位数字验证码"
    ],
    isClick: false,
    totalTime: 60,
    interval: null,
    getCodeText: "获取邮箱验证码"
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
        // var user = {};
        // user.uname = this.name;
        // user.email = this.email;
        // user.upassword = this.password;

        this.$http({
          method: "post",
          url: "/user/register",
          data: this.user,
          params: { code: this.checkCode }
        })
          .then(() => {
            if (confirm("注册成功，您现在要登陆吗？")) {
              this.$router.push("/login");
            }
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    },
    toLogin() {
      this.$router.push("/login");
    },
    sendMsg() {
      //   if (this.isClick) {
      //   }

      if (this.user.email == null || this.user.email == "") {
        alert("请填写邮箱！");
        return;
      }
      this.getCheckCodeBtn(this.totalTime);
      console.log(this.user.email);

      this.$http({
        method: "post",
        url: "/user/code",
        data: this.user.email
      }).catch(() => {
        console.log("验证码发送失败！");
      });
    },
    getCheckCodeBtn(totalTime) {
      let _this = this;
      let _totalTime = totalTime;
      if (totalTime == 0) {
        this.isClick = false;
        this.getCodeText = "获取验证码";
        totalTime = _totalTime;
      } else {
        this.isClick = true;
        this.getCodeText = `验证码${totalTime}s`;
        totalTime--;
        setTimeout(() => {
          _this.getCheckCodeBtn(totalTime);
        }, 1000);
      }
    },
    testPassword() {
      if (this.repassword == "") {
        this.repasswordRules = ["Password is required"];
      } else {
        if (!/^(\w){6,20}$/.test(this.repassword)) {
          this.repasswordRules = ["只能输入6-20个字母、数字、下划线"];
        } else if (this.user.upassword != this.repassword) {
          this.repasswordRules = ["密码不一致"];
        } else {
          this.repasswordRules = [true];
        }
      }
    }
  },
  watch: {
    "user.email"() {
      console.log();

      if (
        this.user.email != null &&
        /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(this.user.email)
      ) {
        this.$http({
          method: "get",
          url: `/user/check/${this.user.email}/3`
        }).then(resp => {
          console.log(resp);
          if (!resp.data) {
            this.emailRules = ["此邮箱已经注册过啦！"];
          } else {
            this.emailRules = [true];
          }
        });
      } else {
        this.emailRules = [
          v => !!v || "E-mail is required",
          v => /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(v) || "E-mail输入错误"
        ];
      }
    },
    "user.uname"() {
      // console.log();
      if (this.user.uname != null && /^[a-zA-Z]{4,10}$/.test(this.user.uname)) {
        this.$http({
          method: "get",
          url: `/user/check/${this.user.uname}/1`
        }).then(resp => {
          console.log(resp);
          if (!resp.data) {
            this.nameRules = ["此用户名已经存在啦，请换一个！"];
          } else {
            this.nameRules = [
              v => !!v || "Name is required",
              v =>
                /^[a-zA-Z]{4,10}$/.test(v) || "只能输入4-10个以字母开头的字串"
            ];
          }
        });
      }
    }
  }
};
</script>
