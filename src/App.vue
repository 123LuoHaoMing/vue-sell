<template>
  <div id="app">
    <!-- 头部区域 -->
    <v-header :seller="seller"></v-header>

    <!-- 导航区域 -->
    <div class="tabs border-1px">
      <router-link class="tabs-item" to="/goods">商品</router-link>
      <router-link class="tabs-item" to="/ratings">评论</router-link>
      <router-link class="tabs-item" to="/seller">商家</router-link>
    </div>

    <!-- 内容区域 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import Header from "components/header/Header"
export default {
  name: 'App',
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.getData();
  }, 
  methods: {
    getData () {
      this.$http.get('/api/seller').then((res) => {
        if (res.body.errno === 0) {
          this.seller = res.body.data;
        } else {
          console.log("请求出错");
        }
      })
    }
  },
  components: {
    "v-header": Header
  }
}
</script>

<style lang="scss" scoped>
@import "./common/css/minimun.scss";
@import "./common/css/style.scss";

#app {
  .tabs {
    display: flex;
    height: 40px;
    @include border_bottom_color(rgba(7, 17, 27, .1));
    .tabs-item {
      flex: 1;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      color: rgb(77, 85, 93);
      &.link-active {
        color: $font_red;
      }
    }
  }
}
</style>
