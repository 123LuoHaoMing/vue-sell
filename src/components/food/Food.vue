<template>
  <transition name="move">
    <div class="food" v-show="showFlag">
      <div class="food-wrapper">
        <div class="food-content">
          <div class="image-header">
            <img :src="selectedFood.image" alt />
            <span class="back-icon icon-arrow_lift" @click="hide"></span>
          </div>
        </div>
        <div class="content border-1px">
          <div class="title">{{selectedFood.name}}</div>
          <div class="details">
            <span class="sell-count">月售{{selectedFood.sellCount}}份</span>
            <span class="rating">好评率{{selectedFood.rating}}%</span>
          </div>
          <div class="price">
            <span class="current-price">￥{{selectedFood.price}}</span>
            <del
              class="old-price"
              v-show="!isNaN(parseFloat(selectedFood.oldPrice))"
            >￥{{selectedFood.oldPrice}}</del>
            <div class="add-cart">
              <div class="add-to-cart" v-show="!selectedFood.count" @click="addToCart">加入购物车</div>
              <v-cartcontrol :food="selectedFood" v-show="selectedFood.count"></v-cartcontrol>
            </div>
          </div>
        </div>
        <v-split v-if="selectedFood.info"></v-split>
        <div class="info" v-if="selectedFood.info">
          <div class="title">商品介绍</div>
          <div class="content">{{selectedFood.info}}</div>
        </div>
        <v-split></v-split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <v-ratingselect
            :selectType="selectType"
            :onlyContent="onlyContent"
            :desc="desc"
            :ratings="selectedFood.ratings"
          ></v-ratingselect>
          <div class="rating-wrapper">
            <ul v-show="selectedFood.ratings && selectedFood.ratings.length">
              <li 
                v-for="rating in selectedFood.ratings" 
                class="rating-item border-1px"
                v-show="showRate(rating.rateType, rating.text)" 
              >
                <div class="user">
                  <span class="username">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate(rating.rateTime)}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!selectedFood.ratings || !selectedFood.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import CartControl from "components/cartcontrol/CartControl";
import Split from "components/split/Split";
import RatingSelect from "components/ratingselect/RatingSelect";
import BScroll from "better-scroll";
import Vue from "vue";
import {formatDate} from "common/js/date";

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽"
      }
    };
  },
  props: {
    selectedFood: {
      type: Object
    }
  },
  created() {
    this.$root.eventHub.$on("selectType", (type) => {
      this.selectType = type;
    });
    this.$root.eventHub.$on("onlyContent", (flag) => {
      this.onlyContent = flag;
    });
  },
  methods: {
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = false;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(".food", {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addToCart() {
      Vue.set(this.selectedFood, "count", 1);
    },
    showRate(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  components: {
    "v-cartcontrol": CartControl,
    "v-split": Split,
    "v-ratingselect": RatingSelect
  }
};
</script>

<style lang="scss" scoped>
@import "../../common/css/style.scss";
@import "../../common/css/minimun.scss";

.food {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 48px;
  z-index: 9;
  background-color: #fff;
  transition: all 0.2s;
  .image-header {
    position: relative;
    width: 100%;
    padding-top: 100%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .back-icon {
      position: absolute;
      left: 12px;
      top: 12px;
      color: #fff;
      padding: 10px;
      background-color: $cart_bgc_black;
      border-radius: 50%;
    }
  }
  .content {
    padding: 18px;
    background-color: #fff;
    @include border_bottom_color($border_color);
    .title {
      font-size: 14px;
      font-weight: $font_weight;
      color: $font_black;
      line-height: 14px;
    }
    .details {
      font-size: 0;
      color: $font_grey;
      margin-top: 8px;
      .sell-count {
        font-size: 10px;
        line-height: 10px;
      }
      .rating {
        font-size: 10px;
        line-height: 10px;
        margin-left: 12px;
      }
    }
    .price {
      font-size: 0;
      margin-top: 18px;
      height: 24px;
      position: relative;
      .current-price {
        font-size: 14px;
        font-weight: $font_weight;
        color: $font_red;
        line-height: 24px;
      }
      .old-price {
        font-size: 10px;
        font-weight: $font_weight;
        color: $font_grey;
        line-height: 24px;
        margin-left: 12px;
      }
      .add-cart {
        position: absolute;
        right: 0;
        bottom: 0;
        .add-to-cart {
          height: 24px;
          background-color: $cart_bgc_blue;
          color: #fff;
          font-size: 10px;
          line-height: 24px;
          padding: 0 12px;
          border-radius: 12px;
        }
      }
    }
  }
  .info {
    padding: 18px;
    background-color: #fff;
    .title {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 6px;
    }
    .content {
      padding: 0 8px;
      font-size: 12px;
      line-height: 24px;
      color: $font_grey;
    }
  }
  .ratings {
    padding: 18px 0;
    .title {
      font-size: 14px;
      line-height: 14px;
      margin-left: 18px;
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item {
        position: relative;
        padding: 16px 0;
        @include border_bottom_color($border_color);
        .user {
          position: absolute;
          right: 0;
          top: 16px;
          line-height: 12px;
          font-size: 0;
          .username {
            display: inline-block;
            margin-right: 6px;
            font-size: 10px;
            color: $font_grey;
            vertical-align: top;
            .avatar {
              border-radius: 50%;
            }
          }
        }
        .time {
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: $font_grey;
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: $font_black;
          .icon-thumb_down {
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
            color: $font_grey;
          }
          .icon-thumb_up {
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
            color: $cart_bgc_blue;
          }
        }
      }
      .no-rating {
        padding: 16px 0;
        font-size: 12px;
        color: $font_grey;
      }
    }
  }
}

.move-enter,
.move-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>