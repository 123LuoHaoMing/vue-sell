<template>
  <div class="shopcart">
    <!-- 购物车 -->
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{ active: totalCount > 0 }">
            <span class="icon-shopping_cart cart"></span>
          </div>
          <div v-show="totalCount>0" class="count">{{totalCount}}</div>
        </div>
        <div class="price" :class="{ active: totalPrice > 0 }">￥{{totalPrice}}</div>
        <div class="desc">配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" v-if="totalPrice < minPrice">￥{{minPrice - totalPrice}}起送</div>
        <div class="toPay" v-if="totalPrice >= minPrice" @click="toPay">去结算</div>
      </div>
    </div>

    <!-- 购物车小球动画 -->
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 购物车列表 -->
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header clearfix">
          <h1 class="title">购物车</h1>
          <!-- <div class="empty" @click="empty">清空</div> -->
        </div>
        <div class="list-content">
          <ul>
            <li v-for="food in selectFoods" class="food-item border-1px">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price * food.count}}</span>
              </div>
              <!-- <div class="cartcontrol-wrapper">
                <v-cartcontrol @add="onAdd" :food="food"></v-cartcontrol>
              </div> -->
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <div class="cover" v-show="listShow" @click="toggleList"></div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import CartControl from "components/cartcontrol/CartControl";
import Vue from "vue";

export default {
  data() {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    };
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(".list-content", {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    }
  },
  methods: {
    onAdd(target) {
      this.$root.eventHub.$emit("cartadd", target)
    },
    // 展示隐藏购物车
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
      console.log(this.listShow);
    },

    // 清空购物车
    empty() {
      // console.log(1);
      // this.$nextTick(() => {
      // this.selectFoods.forEach(food => {
      //   food.count = 0;
      // });
      // })
      for(var i = 0; i< this.selectFoods.length; i ++) {
        this.selectFoods[i].count = 0;
      }
      // this.selectFoods = [];
    },

    // 加入购物车小球动画
    drop(el) {
      console.log(el);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeEnter(el) {
      let count = this.balls.length;
      while (count--) {
        let ball = this.balls[count];
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect();
          let x = rect.left - 32;
          let y = -(window.innerHeight - rect.top - 22);
          el.style.display = "";
          el.style.webkitTransform = `translate3d(0,${y}px,0)`;
          el.style.transform = `translate3d(0,${y}px,0)`;
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.transform = `translate3d(${x}px,0,0)`;
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
        }
      }
    },
    enter(el) {
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.transform = "translate3d(0,0,0)";
        el.style.webkitTransform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.transform = "translate3d(0,0,0)";
        inner.style.webkitTransform = "translate3d(0,0,0)";
      });
    },
    afterEnter(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    },
    toPay() {
      alert(`成功支付${this.totalPrice}元`);
    }
  },
  components: {
    "v-cartcontrol": CartControl
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/style.scss";
@import "../../common/css/minimun.scss";

.shopcart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  width: 100%;
  background-color: $cart_bgc_black;
  z-index: 10;
  .content {
    display: flex;
    .content-left {
      flex: 1;
      font-size: 0;
      color: $font_white;
      .logo-wrapper {
        display: inline-block;
        padding: 6px;
        background-color: #141d27;
        border-radius: 50%;
        margin-left: 16px;
        margin-top: -10px;
        // position: absolute;
        // left: 16px;
        // top: -10px;
        position: relative;
        .logo {
          width: 44px;
          height: 44px;
          text-align: center;
          background-color: $cart_bgc_white;
          border-radius: 50%;
          position: relative;
          &.active {
            background-color: $cart_bgc_blue;
            color: #fff;
          }
          .cart {
            font-size: 24px;
            line-height: 44px;
          }
        }
        .count {
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          background-color: $font_red;
          border-radius: 6px;
          font-size: 9px;
          color: #fff;
          font-weight: $font_weight;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }
      .price {
        display: inline-block;
        font-size: 16px;
        font-weight: $font_weight;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        border-right: 1px solid $font_white;
        &.active {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        font-size: 12px;
        margin-left: 12px;
        vertical-align: top;
        line-height: 48px;
      }
    }
    .content-right {
      .pay {
        width: 105px;
        height: 48px;
        background-color: $cart_bgc_white;
        text-align: center;
        color: $font_white;
        line-height: 48px;
        font-weight: $font_weight;
      }
      .toPay {
        width: 105px;
        height: 48px;
        text-align: center;
        background-color: $cart_bgc_green;
        color: #fff;
        line-height: 48px;
        font-weight: $font_weight;
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 20;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: $cart_bgc_blue;
        transition: all 0.4s linear;
      }
    }
  }
  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    background-color: #fff;
    transform: translate3d(0, -100%, 0);
    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background-color: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      .title {
        float: left;
        font-size: 14px;
        color: $font_black;
      }
      .empty {
        float: right;
        font-size: 12px;
        color: $cart_bgc_blue;
      }
    }
    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background-color: #fff;
      .food-item {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        @include border_bottom_color(rgba(7, 17, 27, 0.1));
        .name {
          line-height: 24px;
          font-size: 14px;
          color: $font_black;
        }
        .price {
          position: absolute;
          right: 10px;
          bottom: 12px;
          line-height: 24px;
          font-size: 14px;
          font-weight: $font_weight;
          color: $font_red;
        }
        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 6px;
        }
      }
    }
  }
  // .fold-enter-active, .fold-leave-active {
  //   transition: all .5s ease-in-out;
  //   transform: translate3d(0, -100%, 0);
  // }
  // .fold-enter, .fold-leave {
  //   // transition: all .3s ease-in-out;
  //   transform: translate3d(0, 0, 0);
  // }
}
.cover {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: -2;
  background-color: rgba(7, 17, 27, .6); 
}
</style>