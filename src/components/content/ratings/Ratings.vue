<template>
  <div class="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="score-type">综合评分</div>
          <div class="desc">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="item">
            <div class="title">服务态度</div>
            <v-star :size="36" :score="seller.serviceScore"></v-star>
            <div class="fill"></div>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="item">
            <div class="title">商品评分</div>
            <v-star :size="36" :score="seller.foodScore"></v-star>  
            <div class="fill"></div>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="item">
            <div class="title">送达时间</div>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <v-split></v-split>
      <v-ratingselect :ratings="ratings"></v-ratingselect>
      <ul class="ratings-list" v-show="ratings.length !== 0">
        <li class="rating-item border-1px" v-for="rating in ratings" v-show="showRate(rating.rateType, rating.text)">
          <div class="avatar">
            <img :src="rating.avatar" width="28" height="28">
          </div>
          <div class="info-wrapper">
            <div class="name">{{rating.username}}</div>
            <div class="star-score">
              <v-star :size="24" :score="rating.score"></v-star>
              <span class="delivery-time">{{rating.deliveryTime}}分钟</span>
            </div>
            <div class="time">{{rating.rateTime | formatDate(rating.rateTime)}}</div>
            <div class="text">{{rating.text}}</div>
            <ul class="recommend">
              <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>
              <li class="recommend-item" v-for="item in rating.recommend">
                {{item}}
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="no-rating" v-show="ratings.length === 0">
        暂无评价
      </div>
    </div>
  </div>
</template>

<script>
import Star from 'components/star/Star';
import Split from "components/split/Split";
import RatingSelect from "components/ratingselect/RatingSelect";
import BScroll from "better-scroll";
import {formatDate} from "common/js/date";

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  data() {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: false
    }
  },
  props: {
    seller: {
      type: Object
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  created() {
    this.getDate();
    this.$root.eventHub.$on("selectType", (type) => {
      this.selectType = type;
    });
    this.$root.eventHub.$on("onlyContent", (flag) => {
      this.onlyContent = flag;
    });
  },
  methods: {
    getDate() {
      this.$http.get("/api/ratings").then((res) => {
        if (res.body.errno === 0) {
          this.ratings = res.body.data;
          this.$nextTick(() => {
            this.scroll = new BScroll('.ratings');
          });
        } else {
          console.log("请求出错");
        }
      })
    },
    showRate(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType == ALL) {
        return true;
      } else {
        return this.selectType === type;
      }
    }
  },
  components: {
    "v-star": Star,
    "v-split": Split,
    "v-ratingselect": RatingSelect
  }
}
</script>

<style lang="scss" scoped>
@import "../../../common/css/style.scss";
@import "../../../common/css/minimun.scss";

.ratings {
  position: absolute;
  left: 0;
  right: 0;
  top: 174px;
  bottom: 0;
  overflow: hidden;
  .overview {
    display: flex;
    padding: 18px 0;
    .overview-left {
      width: auto;
      padding: 0 18px;
      text-align: center;
      border-right: 1px solid $border_color;
      @media only screen and (max-width: 320px) {
        padding: 0 6px;
      }
      .score {
        font-size: 24px;
        line-height: 28px;
        color: $font_orange;
      }
      .score-type {
        font-size: 12px;
        line-height: 12px;
        color: $font_black;
        margin-top: 6px;
      }
      .desc {
        margin-top: 8px;
        font-size: 10px;
        color: $font_shallow_black;
        line-height: 10px;
      }
    }
    .overview-right {
      flex: 1;
      padding: 0 24px;
      @media only screen and (max-width: 320px) {
        padding: 0 12px;
      }
      .item {
        font-size: 0;
        display: flex;
        margin-bottom: 8px;
        &:last-child {
          margin-bottom: 0;
        }
        .title {
          display: inline-block;
          font-size: 12px;
          line-height: 18px;
          color: $font_black;
          margin-right: 12px;
          @media only screen and (max-width: 320px) {
            margin-right: 6px;
          }
        }
        .star {
          display: inline-block;
        }
        // .fill {
        //   flex: 1;
        // }
        .score {
          display: inline-block;
          font-size: 12px;
          line-height: 18px;
          color: $font_orange;
          margin-left: 8px;
          @media only screen and (max-width: 320px) {
            margin-left: 6px;
          }
        }
        .time {
          font-size: 12px;
          color:$font_grey;
          line-height: 18px;
        }
      }
    }
  }
  .ratings-list {
    .rating-item {
      padding: 18px 0;
      margin: 0 18px;
      @include border_bottom_color($border_color);
      display: flex;
      .avatar {
        margin-right: 12px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        overflow: hidden;
      }
      .info-wrapper {
        flex: 1;
        position: relative;
        .name {
          font-size: 10px;
          color: $font_black;
          line-height: 12px;
        }
        .star-score {
          margin-top: 4px;
          font-size: 0;
          .star {
            display: inline-block;
            vertical-align: middle;
          }
          .delivery-time {
            display: inline-block;
            vertical-align: middle;
            margin-left: 6px;
            font-size: 10px;
            color: $font_grey;
            line-height: 12px;
          }
        }
        .time {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 10px;
          color: $font_grey;
          line-height: 12px;
        }
        .text {
          margin-top: 6px;
          font-size: 12px;
          line-height: 18px;
          color: $font_black;
        }
        .recommend {
          font-size: 0;
          .icon-thumb_up {
            display: inline-block;
            font-size: 12px;
            line-height: 16px;
            color: $cart_bgc_blue;
          }
          .icon-thumb_down {
            display: inline-block;
            font-size: 12px;
            line-height: 16px;
            color: rgb(183, 189, 191);
          }
          .recommend-item {
            display: inline-block;
            margin-left: 8px;
            margin-top: 8px;
            padding: 3px 6px;
            font-size: 9px;
            line-height: 16px;
            color: $font_grey;
            border: 1px solid $font_grey;
          }
        }
      }
    }
  }
}
</style>