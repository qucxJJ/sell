<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-container">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="title">{{food.name}}</div>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count||food.count===0" @click="addFirst($event)">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :description="description" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length" class="rating-items">
              <li v-show="needShow(rating.rateType,rating.text)" class="rating-item" v-for="rating in food.ratings">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" class="avatar" width="12px" height="12px">
                </div>
                <div class="time">{{rating.rateTime | formatTime}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from 'common/js/date.js';
  import cartcontrol from '../../components/cartcontrol/cartcontrol.vue';
  import split from '../../components/split/split.vue';
  import ratingselect from '../../components/ratingselect/ratingselect.vue';
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        description: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        this.description = {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        };
      },
      hide() {
        this.showFlag = false;
      },
      addFirst($event) {
        if (!$event._constructed) {
          return;
        }
        this.$root.eventHub.$emit('cartAdd', $event.target);
        Vue.set(this.food, 'count', 1);
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      },
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food,
            { click: true });
        } else {
          this.scroll.refresh();
        }
      }
    },
    filters: {
      formatTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    ready() {
      this.$nextTick(() => {
        this.initScroll();
      });
    },
    watch: {
      'food' () {
        this.$nextTick(() => {
          this.initScroll();
        });
      }
    },
    created() {
      this.$nextTick(() => {
        this.initScroll();
      });
      this.$root.eventHub.$on('ratingTypeSelect', (selectType) => {
        this.selectType = selectType;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      });
      this.$root.eventHub.$on('toggleContentSwitch', (onlyContent) => {
        this.onlyContent = onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    background: #ffffff
    z-index: 30
    width: 100%
    transform: translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transition: all 0.2s linear
    &.move-enter,&.move-leave-active
      transform: translate3d(100%,0,0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: #ffffff

    .content
      position: relative
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        font-size: 0
        height: 10px
        .sell-count,.rating
          font-size: 10px
          color: rgb(147,153,159)
        .sell-count
          margin-right: 12px
      .price
        line-height: 24px
        font-weight: 700
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240,20,20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147,153,159)


      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        font-size: 10px
        border-radius: 12px
        color: #ffffff
        background: rgb(0,160,220)
        opacity: 1
        &.fade-enter-active,&.fade-leave-active
          transition: all 0.2s linear
        &.fade-enter,&.fade-leave-active
          opacity: 0
    .info
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 16px
        font-size: 14px
        color: rgb(7,17,27)
      .text
        line-height: 24px
        padding: 0 8px
        font-size: 12px
        color: rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size: 14px
        color: rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-items
          .rating-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7,17,27,0.1))
            font-size: 12px
            line-height: 16px
            .user
              position: absolute
              right: 0
              top: 16px
              font-size: 0
              line-height: 12px
              .name
                display: inline-block
                vertical-align: top
                font-size: 10px
                color: rgb(147,153,159)
                margin-right: 6px
              .avatar
                border-radius: 50%

            .time
              margin-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147,153,159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7,17,27)
              .icon-thumb_up,.icon-thumb-down
                line-height: 16px
                margin-right: 4px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0,160,220)
              .icon-thumb-down
                color: rgb(147,153,159)
        .no-ratings
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>
