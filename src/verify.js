export async function verify() {
    await this.$http({
            method: "get",
            url: "/auth/verify",
            async: false
        })
        .then(resp => {
            this.userInfo = resp.data;
            this.$store.dispatch("changeUserInfo", resp.data);
            // console.log("verify");

        })
        .catch(() => {

            this.userInfo = {};
            this.$store.dispatch("changeUserInfo", {});

        });
    return Promise.resolve()
}