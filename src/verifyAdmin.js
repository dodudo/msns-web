export async function verifyAdmin() {
    await this.$http({
            method: "get",
            url: "/admin/verify",
            async: false
        })
        .then(resp => {
            this.userInfo = resp.data;
            this.$store.dispatch("changeAdminInfo", resp.data);
            // console.log("verify");
        })
        .catch(() => {
            this.userInfo = {};
            this.$store.dispatch("changeAdminInfo", {});
            this.$router.push("/admin/login");
        });
    return Promise.resolve();
}