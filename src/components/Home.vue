<template>
  <div>
    home组件
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {
    logout() {
      // 点击退出时，清除token值
      window.sessionStorage.removeItem('token')
      // console.log(this)
      // 跳转回登录页面
      this.$router.push('/login') // this??
    }
  },

  created() {}
}
</script>

<style lang='less' scoped>
</style>
