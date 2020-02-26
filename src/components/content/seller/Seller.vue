<template>
  <div class="seller">
    <div class="seller-scroll">
      <h1 class="name">{{seller.name}}</h1>
      <div class="score border-1px">
        <v-star :score="seller.score" :size="36"></v-star>
        <span class="count">({{seller.ratingCount}})</span>
        <span class="sell-count">月售{{seller.sellCount}}单</span>
        <div class="collect" @click="toggleCollect">
          <div class="icon-favorite icon" :class="{'had-collect': isCollect}"></div>
          <div class="collect-text" v-show="isCollect">已收藏</div>
          <div class="collect-text" v-show="!isCollect">未收藏</div>
        </div>
      </div>
      <div class="delivery-wrapper">
        <div class="delivery">
          <div class="title">起送价</div>
          <div class="price">
            <span class="num">{{seller.minPrice}}</span>
            <span>元</span>
          </div>
        </div>
        <div class="delivery">
          <div class="title">商家配送</div>
          <div class="price">
            <span class="num">{{seller.deliveryPrice}}</span>
            <span>元</span>
          </div>
        </div>
        <div class="delivery">
          <div class="title">平均配送时间</div>
          <div class="price">
            <span class="num">{{seller.deliveryTime}}</span>
            <span>分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="text">{{seller.bulletin}}</div>
        <ul class="activity-list">
          <li class="item border-1px" v-for="support in seller.supports">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="live">
        <div class="title">商家实景</div>
        <ul class="image-wrapper clearfix">
          <li class="image-item" v-for="pic in seller.pics">
            <img :src="pic" width="120" height="90" />
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <div class="info">
        <div class="title">商家信息</div>
        <ul class="info-list">
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Split from "components/split/Split";
import Star from "components/star/Star";
import BScroll from "better-scroll";
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      isCollect: true
    };
  },
  watch: {
    seller() {
      this._initScroll();
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(".seller", {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    },
    toggleCollect() {
      if (!this.isCollect) {
        Toast({
          iconClass: "icon-favorite",
          message: "收藏成功",
          position: "middle",
          duration: 2000
        });
      }
      this.isCollect = !this.isCollect;
    }
  },
  components: {
    "v-split": Split,
    "v-star": Star
  }
};
</script>

<style lang="scss" scoped>
@import "../../../common/css/minimun.scss";
@import "../../../common/css/style.scss";

.seller {
  .name {
    font-size: 14px;
    line-height: 14px;
    color: $font_black;
    padding: 18px 18px 8px 18px;
  }
  .score {
    margin: 0px 18px;
    padding-bottom: 18px;
    position: relative;
    font-size: 0;
    @include border_bottom_color($border_color);
    .star {
      display: inline-block;
      vertical-align: top;
    }
    .count {
      display: inline-block;
      margin-left: 8px;
      margin-right: 12px;
      font-size: 10px;
      line-height: 18px;
      color: $rating_bgc_grey;
    }
    .sell-count {
      display: inline-block;
      font-size: 10px;
      line-height: 18px;
      color: $rating_bgc_grey;
    }
    .collect {
      position: absolute;
      right: 0;
      top: -24px;
      .icon {
        padding: 0 4px;
        font-size: 24px;
        line-height: 24px;
        color: $font_grey;
        &.had-collect {
          color: $font_red;
        }
      }
      .collect-text {
        margin-top: 4px;
        font-size: 10px;
        line-height: 10px;
        color: $rating_bgc_grey;
      }
    }
  }
  .delivery-wrapper {
    padding: 18px 0;
    display: flex;
    .delivery {
      flex: 1;
      text-align: center;
      .title {
        color: $font_grey;
        font-size: 10px;
        line-height: 10px;
      }
      .price {
        margin-top: 4px;
        .num {
          font-size: 24px;
          line-height: 24px;
          color: $font_black;
        }
        span {
          font-size: 10px;
          line-height: 24px;
        }
      }
    }
  }
  .bulletin {
    margin: 0 18px;
    padding-top: 18px;
    font-size: 0;
    @include border_bottom_color($border_color);
    .title {
      margin-bottom: 8px;
      font-size: 14px;
      color: $font_black;
      font-weight: $font_weight;
    }
    .text {
      padding: 0 12px;
      padding-bottom: 18px;
      font-size: 12px;
      line-height: 24px;
      color: $font_red;
    }
    .activity-list {
      .item {
        padding: 16px 12px;
        @include border_top_color($border_color);
        .icon {
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          margin-right: 2px;
          background-size: 16px 16px;
          &.decrease {
            @include localBackgroudImage("decrease_4");
          }
          &.discount {
            @include localBackgroudImage("discount_4");
          }
          &.guarantee {
            @include localBackgroudImage("guarantee_4");
          }
          &.invoice {
            @include localBackgroudImage("invoice_4");
          }
          &.special {
            @include localBackgroudImage("special_4");
          }
        }
        .text {
          vertical-align: middle;
        }
      }
    }
  }
  .live {
    padding: 18px;
    .title {
      margin-bottom: 8px;
      font-size: 14px;
      color: $font_black;
      font-weight: $font_weight;
    }
    .image-wrapper {
      .image-item {
        float: left;
        margin-right: 6px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .info {
    padding: 18px;
    .title {
      margin-bottom: 8px;
      font-size: 14px;
      color: $font_black;
      font-weight: $font_weight;
    }
    .info-list {
      .info-item {
        padding: 16px 12px;
        @include border_top_color($border_color);
        font-size: 12px;
        line-height: 16px;
        color: $font_black;
      }
    }
  }
}
</style>