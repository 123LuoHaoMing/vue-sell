<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active': selectType===2 }" @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': selectType===0 }" @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active': selectType===1 }" @click="select(1, $event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch">
      <span class="icon icon-check_circle" :class="{'active': onlyContent }" @click="toggleContent"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
  props: {
    ratings: {
      type: Array, 
      default() {
        return [];
      }
    },
    selectType: {
      type: Number, 
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: "全部",
          positive: "满意",
          negative: "不满意"
        }
      }
    }
  },
  methods: {
    select(type, event) {
      // if (!event._constructed) {
      //   console.log(event._constructed);
      //   return;
      // }
      this.selectType = type;
      this.$root.eventHub.$emit("selectType", type);
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
      this.$root.eventHub.$emit("onlyContent", this.onlyContent);
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../common/css/style.scss";
@import "../../common/css/minimun.scss";

.ratingselect {
  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    @include border_bottom_color($border_color);
    font-size: 0;
    .block {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 1px;
      margin-right: 8px;
      color: $rating_bgc_grey;
      line-height: 16px;
      font-size: 12px;
      .count {
        font-size: 8px;
        margin-left: 2px;
        line-height: 16px;
      }
      &.positive {
        background-color: $rating_bgc_shallow_blue;
        &.active {
          background-color: $rating_bgc_blue;
          color: #fff;
        }
      }
      &.negative {
        background-color: $rating_bgc_shallow_grey;
        &.active {
          background-color: $rating_bgc_grey;
          color: #fff;
        }
      }
    }
  }
  .switch {
    padding: 12px 18px;
    line-height: 24px;
    @include border_bottom_color($border_color);
    color: $font_grey;
    font-size: 0;
    .icon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      font-size: 24px;
      &.active {
        color: $cart_bgc_green;
      }
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
    }
  }
}
</style>