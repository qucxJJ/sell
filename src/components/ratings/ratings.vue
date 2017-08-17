<template>
  <div class="ratings-all" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left border-right-1px">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="rank-rate">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :score="seller.foodScore" :size="36"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :score="seller.serviceScore" :size="36"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="delivery-description">
            <span class="delivery-des">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent"></ratingselect>
      <div class="rating-wrapper">
        <ul v-show="ratings && ratings.length" class="rating-container">
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
            <img :src="rating.avatar" class="avatar">
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :score="rating.score" :size="24"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="item in rating.recommend" class="item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatTime}}</div>
            </div>
          </li>
        </ul>
        <div class="no-rating" v-show="!ratings || !ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from 'components/star/star.vue';
  import ratingselect from 'components/ratingselect/ratingselect.vue';
  import split from 'components/split/split.vue';
  import {formatDate} from 'common/js/date.js';
  const ERR_OK = 0;
  const ALL = 2;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    filters: {
      formatTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          });
        }
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
    },
    components: {
      star,
      ratingselect,
      split
    },
    methods: {
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  @import '../../common/stylus/base.styl'
  .ratings-all
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .ratings-content
      width: 100%
      .overview
        display: flex
        padding: 18px 0
        .overview-left
          flex: 0 0 137px
          width: 137px
          padding: 6px 0
          text-align: center
          @media only screen and (max-width: 320px)
            flex: 0 0 120px
            width: 120px
          border-right-1px(rgba(7,17,27,0.1))
          .score
            font-size: 24px
            color: rgb(255,153,0)
            line-height: 28px
            margin-bottom: 6px
          .title
            font-size: 12px
            line-height: 12px
            color: rgb(7,17,27)
            margin-bottom: 8px
          .rank-rate
            font-size: 10px
            line-height: 10px
        .overview-right
          flex: 1
          padding: 6px 0 6px 24px
          color: rgb(7,17,27)
          @media only screen and (max-width: 320px)
            padding-left: 6px
          .score-wrapper
            margin-bottom: 8px
            font-size: 0
            .title
              display: inline-block
              vertical-align: top
              font-size: 12px
              line-height: 18px
              color: rgb(7,17,27)
            .star
              display: inline-block
              vertical-align: top
              margin: 0 12px
            .score
              display: inline-block
              vertical-align: top
              font-size: 12px
              line-height: 18px
              color: rgb(255,153,0)
          .delivery-description
            font-size: 0
            .delivery-des
              font-size: 12px
              line-height: 18px
              margin-right: 12px
              color: rgb(7,17,27)
            .time
              font-size: 12px
              line-height: 18px
              color: rgb(147,153,159)
      .rating-wrapper
        padding: 0 18px
        .rating-container
          .rating-item
            display: flex
            padding: 18px 0
            border-1px(rgba(7,17,27,0.1))
            .avatar
              flex: 0 0 28px
              width: 28px
              height: 28px
              border-radius: 50%
              margin-right: 12px
            .content
              position: relative
              flex: 1
              .name
                font-size: 10px
                line-height: 12px
                color: rgb(7, 17, 27)
                margin-bottom: 4px
              .star-wrapper
                margin-bottom: 6px
                font-size: 0
                .star
                  display: inline-block
                  margin-right: 6px
                  vertical-align: top
                .delivery
                  display: inline-block
                  vertical-align: top
                  font-size: 10px
                  line-height: 12px
                  color: rgb(147,153,159)
                  font-weight: 200
              .text
                font-size: 12px
                line-height: 18px
                margin-bottom: 8px
                color: rgb(7,17,27)
              .recommend
                line-height: 16px
                font-size: 0
                .icon-thumb_up,.item
                  display: inline-block
                  margin: 0 8px 4px 0
                  font-size: 9px
                .icon-thumb_up
                  color: rgb(0,160,220)
                .item
                  border: 1px solid rgba(7,17,27,0.1)
                  border-radius: 1px
                  padding: 0 6px
                  color: rgb(147,153,159)
                  background: #fff
              .time
                position: absolute
                top: 0
                right: 0
                font-size: 10px
                line-height: 12px
                font-weight: 200
                color: rgb(147, 153, 159)







</style>
