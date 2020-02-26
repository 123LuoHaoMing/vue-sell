<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script>
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
    props: {
      size: {
        type: Number
      }, 
      score: {
        type: Number
      }
    },
    created () {
      console.log(this.score)
    },
    computed: {
      starType() {
        return "star-" + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        // 是否有小数（半颗星）
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i ++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/css/minimun.scss';

  .star {
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48 {
      .star-item {
        width: 20px;
        height: 20px; 
        margin-right: 22px;
        background-size: 20px 20px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include localBackgroudImage('star48_on')
        }
        &.half {
          @include localBackgroudImage('star48_half')
        }
        &.off {
          @include localBackgroudImage('star48_off')
        }
      }
    }
    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        margin-right: 6px;
        background-size: 15px 15px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include localBackgroudImage('star36_on')
        }
        &.half {
          @include localBackgroudImage('star36_half')
        }
        &.off {
          @include localBackgroudImage('star36_off')
        }
      }
    }
    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          @include localBackgroudImage('star24_on')
        }
        &.half {
          @include localBackgroudImage('star24_half')
        }
        &.off {
          @include localBackgroudImage('star24_off')
        }
      }
    }
  }
</style>