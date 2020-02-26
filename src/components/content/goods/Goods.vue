<template>
  <div class="goods">
    <!-- 菜单导航 -->
    <div class="menu-wrapper-scroll">
      <ul class="menu-wrapper">
        <li v-for="(item, index) in goods" class="menu-item" 
          :class="{ active: currentIndex==index }"
          @click="selectMenu(index, $event)"
        >
          <span class="text border-1px">
            <span v-show="item.type >= 0" :class="classMap[item.type]" class="icon"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>

    <!-- 食品区域 -->
    <div class="foods-wrapper-scroll">
      <ul class="foods-wrapper" ref="foods">
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul class="food-item-wrapper">
            <li v-for="food in item.foods" class="food-item border_1px" @click="selectFood(food)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57"/>
              </div>
              <div class="content">
                <div class="name">{{food.name}}</div>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="current-price">￥{{food.price}}</span>
                  <del
                    class="old-price"
                    v-show="!isNaN(parseFloat(food.oldPrice))"
                  >￥{{food.oldPrice}}</del>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 购物车 -->
    <v-shopcart 
      ref="shopcart"
      :deliveryPrice="seller.deliveryPrice" 
      :minPrice="seller.minPrice" 
      :selectFoods="selectFoods"
    ></v-shopcart>

    <!-- 食品详情 -->
    <v-food :selectedFood="selectedFood" ref="food"></v-food>
  </div>
</template>

<script>
// 滚动，联动插件
import BScroll from "better-scroll";
import ShopCart from 'components/shopcart/ShopCart';
import Food from 'components/food/Food';
import CartControl from 'components/cartcontrol/CartControl';

export default {
  data() {
    return {
      goods: [],
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  props: {
    seller: {
      type: Object
    }
  },
  created() {
    this.getData();
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let selectFoods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            selectFoods.push({
              "name": food.name,
              "price": food.price,
              "count": food.count
            });
          }
        });
      });
      return selectFoods;
    }
  },
  methods: {
    getData() {
      this.$http.get("/api/goods").then(res => {
        if (res.body.errno === 0) {
          this.goods = res.body.data;
          this.$nextTick(() => {
            this.initBScroll();
            this.calulateHeight();

            // 接收广播，传递当前点击对象
            this.$root.eventHub.$on("cartadd", (target) => {
              this._drop(target);
            })
          });
        } else {
          console.log("请求出错");
        }
      });
    },
    // 为菜单区域，食品区域添加滚动，并实时更新滚动的 y值
    initBScroll() {
      this.menuScroll = new BScroll(".menu-wrapper-scroll", {
        click: true
      });
      this.foodsScroll = new BScroll(".foods-wrapper-scroll", {
        probeType: 3,
        click: true,
        mouseWheel: true
      });

      this.foodsScroll.on("scroll", pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
        console.log(this.scrollY);
      });
    },
    // 计算每部分 食品类 的高度
    calulateHeight() {
      let foodList = this.$refs.foods.getElementsByClassName("food-list-hook");
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      console.log(this.listHeight);
    },
    // 选中菜单栏，食品区域跟着联动
    selectMenu(index, event) {
      if (!event._constructed) {
        // return;
      }
      let foodList = this.$refs.foods.getElementsByClassName("food-list-hook");
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 100);
    },
    _drop(target) {
      console.log("_dorp");
      this.$refs.shopcart.drop(target);
    },
    // 食品详情
    selectFood(food) {
      this.selectedFood = food;
      this.$refs.food.show();
    }
  },
  components: {
    "v-shopcart": ShopCart,
    "v-cartcontrol": CartControl,
    "v-food": Food,
  }
};
</script>

<style lang="scss" scoped>
@import "../../../common/css/minimun.scss";
@import "../../../common/css/style.scss";

.goods {
  display: flex;
  position: absolute;
  width: 100%;
  top: 174px;
  bottom: 48px;
  overflow: hidden;
  .menu-wrapper {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 80px;
    background-color: #f3f5f7;
    .menu-item {
      display: table;
      height: 54px;
      padding: 0 8px;
      line-height: 14px;
      &.active {
        position: relative;
        margin-top: -1px;
        background-color: #fff;
        .text {
          font-weight: 700;
          @include border_bottom_color(#fff);
        }
      }
      .text {
        display: table-cell;
        width: 64px;
        vertical-align: middle;
        font-size: 12px;
        color: $font_black;
        text-align: center;
        @include border_bottom_color(rgba(7, 17, 27, 0.1));
        .icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          background-size: 12px 12px;
          vertical-align: top;
          &.decrease {
            @include localBackgroudImage("decrease_3");
          }
          &.discount {
            @include localBackgroudImage("discount_3");
          }
          &.guarantee {
            @include localBackgroudImage("guarantee_3");
          }
          &.invoice {
            @include localBackgroudImage("invoice_3");
          }
          &.special {
            @include localBackgroudImage("special_3");
          }
        }
      }
    }
  }
  .foods-wrapper {
    position: absolute;
    top: 0;
    left: 80px;
    // width: 100%;
    flex: 1;
    .food-list {
      .title {
        position: relative;
        height: 26px;
        line-height: 26px;
        background-color: #f3f5f7;
        font-size: 12px;
        padding: 0 14px;
        color: $font_grey;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 26px;
          background-color: #d9dde1;
        }
      }
      .food-item-wrapper {
        padding: 0 18px;
        .food-item {
          padding: 18px 0;
          display: flex;
          @include border_bottom_color(rgba(7, 17, 27, 0.1));
          &:last-child {
            @include border_bottom_color(#fff);
          }
          .icon {
            border-radius: 2px;
          }
          .content {
            flex: 1;
            margin-left: 10px;
            position: relative;
            .name {
              font-size: 14px;
              color: $font_black;
              line-height: 14px;
              margin-bottom: 8px;
            }
            .desc {
              font-size: 10px;
              color: $font_grey;
              line-height: 10px;
              margin-bottom: 8px;
            }
            .extra {
              font-size: 10px;
              color: $font_grey;
              line-height: 10px;
              margin-bottom: 8px;
              span {
                margin-right: 12px;
              }
            }
            .price {
              font-weight: 700;
              line-height: 24px;
              .current-price {
                font-size: 14px;
                color: $font_red;
                margin-right: 4px;
              }
              .old-price {
                font-size: 10px;
                color: $font_grey;
              }
            }
            .cartcontrol-wrapper {
              position: absolute;
              right: 0px;
              bottom: -6px;
            }
          }
        }
      }
    }
  }
}
</style>