<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-reduce icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart"></div>
    </transition>
    <transition name="fade">
      <div class="cart-count"  v-show="food.count>0">{{food.count}}</div>
    </transition>
    <div class="cart-add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  props: {
    food: {
      type: Object
    }
  },
  created() {
  },
  methods: {
    addCart(event) {
      if (!this.food.count) {
        // 在vue中设置对象的属性，若要被之后有逻辑渲染，需要用vue.set设置
        this.$set(this.food, "count", 1);
      } else {
        this.food.count ++;
      }
      // 发送广播，将当前的 + 号按钮对象传出去，以便获取其位置，实现动画效果
      this.$root.eventHub.$emit("cartadd", event.target)
      // this.$root.eventHub.$emit("changeCount", "123")
    },
    decreaseCart() {
      if (this.food.count) {
        this.food.count --;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/css/style.scss";

.cartcontrol {
  font-size: 0;
  .cart-reduce, .cart-add {
    display: inline-block;
    padding: 6px;
    color: $cart_bgc_blue;
    line-height: 24px;
    font-size: 24px;
    transition: all 0.5s;
  }
  .cart-count {
    display: inline-block;
    width: 10px;
    height: 24px;
    font-size: 12px;
    text-align: center;
    vertical-align: top;
    margin-top: 11px;
    color: rgb(147, 153, 159);
    transition: all 0.1s;
  }
  // .fade-enter-active, .fade-leave-actiev {
  //   transition: all 0.5s;
  // }
  .fade-enter, .fade-leava-to {
    opacity: 0;
  }
  // .move-enter-active, .move-leave-actiev {
  //   transition: all 0.5s;
  // }
  .move-enter, .move-leave-to {
    transform: translateX(36px) rotate(360deg);
    opacity: 0;
  }
}
</style>