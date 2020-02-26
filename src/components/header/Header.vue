<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height="64" :src="seller.avatar" alt="">
      </div>
      <div class="seller-information">
        <div class="name-wrapper">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
          <span class="count" @click="showDetails">
            {{seller.supports.length}}个<i class="icon-keyboard_arrow_right"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetails">
      <span class="icon"></span>
      <span class="text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background-wrapper">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <transition name='fade'>
      <div v-show="detailsShow" class="details-wrapper">
        <div class="details-main clearfix">
          <div class="details">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <v-star :size="48" :score="seller.score"></v-star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item, index) in seller.supports" class="support-item">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin-details">
              <div class="text">{{seller.bulletin}}</div>
            </div>
          </div>
        </div>
        <div class="details-close" @click="hideDetails">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Star from 'components/star/Star'

  export default {
    data () {
      return {
        classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
        detailsShow: false
      }
    },
    methods: {
      showDetails () {
        this.detailsShow = true;
      },
      hideDetails () {
        this.detailsShow = false;
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      "v-star": Star
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/css/minimun.scss';
  .header {
    position: relative;
    background-color: rgba(7, 17, 27, .5);
    color: #fff;
    overflow: hidden;
    .content-wrapper {
      padding: 24px 12px 18px 24px;
      font-size: 0;
      position: relative;
      .avatar {
        display: inline-block;
        vertical-align: middle;
        img {
          border-radius: 5px;
        }
      }
      .seller-information {
        display: inline-block;
        vertical-align: middle;
        margin-left: 16px;
        .name-wrapper {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
          .brand {
            display: inline-block;
            width: 30px;
            height: 18px;
            vertical-align: middle;
            @include localBackgroudImage('brand');
            background-size: 30px 18px;
          }
          .name {
            vertical-align: middle;
          }
        }
        .description {
          margin-bottom: 10px;
          font-size: 12px;
        }
        .supports{
          font-size: 10px;
          .icon {
            display: inline-block;
            vertical-align: middle;
            width: 13px;
            height: 12px;
            margin-right: 2px;
            background-size: 13px 12px;
            &.decrease {
              @include localBackgroudImage('decrease_1')
            }
            &.discount {
              @include localBackgroudImage('discount_1')
            }
            &.guarantee {
              @include localBackgroudImage('guarantee_1')
            }
            &.invoice {
              @include localBackgroudImage('invoice_1')
            }
            &.special {
              @include localBackgroudImage('special_1')
            }
          }
          .text {
            vertical-align: bottom;
          }
          .count {
            position: absolute;
            bottom: 15px;
            right: 12px;
            height: 24px;
            line-height: 25px;
            padding: 0 8px;
            background-color: rgba(0,0,0,.2);
            font-size: 10px;
            border-radius: 14px;
            .icon-keyboard_arrow_right {
              position: relative;
              top: 1px;
            }
          }
        }
      }
    }
    .bulletin-wrapper {
      height: 28px;
      line-height: 28px;
      padding: 0 22px 0 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      .icon {
        display: inline-block;
        width: 22px;
        height: 12px;
        @include localBackgroudImage('bulletin');
        background-size: 22px 12px;
        vertical-align: middle;
      }
      .text {
        font-size: 10px;
        vertical-align: middle;
      }
      .icon-keyboard_arrow_right {
        position: absolute;
        top: 9px;
        right: 12px;
        font-size: 10px;
      }
    }
    .background-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      filter: blur(10px);
    }
    .details-wrapper {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, .8);
      z-index: 99;
      overflow: auto;
      .details-main {
        min-height: 100%;
        .details {
          padding: 64px 0;
          .name {
            font-size: 16px;
            line-height: 16px;
            text-align: center;
            font-weight: 700;
          }
          .star-wrapper {
            margin-top: 18px;
            padding: 2px 0;
            text-align: center;
          }
          .title {
            display: flex;
            width: 80%;
            margin: 30px auto 24px auto;
            .text {
              padding: 0 12px;
              font-size: 14px;
            }
            .line {
              flex: 1;
              position: relative;
              top: -6px;
              border-bottom: 1px solid rgba(255, 255, 255, .2);
            }
          }
          .supports {
            width: 80%;
            margin: 0 auto;
            .support-item {
              margin-bottom: 12px;
              padding: 0 12px;
              &:last-child {
                margin-bottom: 0;
              }
              .icon {
                display: inline-block;
                vertical-align: top;
                width: 16px;
                height: 16px;
                margin-right: 6px;
                background-size: 16px 16px;
                &.decrease {
                  @include localBackgroudImage('decrease_2')
                }
                &.discount {
                  @include localBackgroudImage('discount_2')
                }
                &.guarantee {
                  @include localBackgroudImage('guarantee_2')
                }
                &.invoice {
                  @include localBackgroudImage('invoice_2')
                }
                &.special {
                  @include localBackgroudImage('special_2')
                }
              }
              .text {
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
          .bulletin-details {
            width: 80%;
            margin: 0 auto;
            .text {
              padding: 0 12px;
              font-size: 12px;
              line-height: 24px;
              font-weight: 200;
            }
          }
        }
      }
      .details-close {
        position: relative;
        width: 32px;
        height: 32px;
        margin: -64px auto 0 auto;
        font-size: 32px;
      }
    }

    .fade-enter-active, .fade-leave-active {
      transition: all .5s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>