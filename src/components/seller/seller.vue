<template>
  <div class="seller" ref="seller">
    <div class="seller-container">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="description border-1px">
          <star :score="seller.score" :size="36"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{active:favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin border-1px">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>

      </div>
      <div class="support-wrapper">
        <ul v-show="seller.supports" class="supports">
          <li v-for="support in seller.supports" class="support-item border-1px">
            <span class="support-icon" :class="classMap[support.type]"></span>
            <span class="support-text">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="pic-title">商家实景</h1>
        <div class="pic-wrapper" ref="wrapper">
          <ul class="pic-list" ref="list">
            <li v-for="pic in seller.pics" class="pic-item">
              <img :src="pic" class="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <h1 class="info-title">商家信息</h1>
        <ul class="info-wrapper">
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {saveToLocal, loadFromLocal} from 'common/js/store.js';
  import BScroll from 'better-scroll';
  import star from 'components/star/star.vue';
  import split from 'components/split/split.vue';
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    created() {
      this.classMap = [ 'decrease', 'discount', 'special', 'invoice', 'guarantee' ];
      this.$nextTick(() => {
        this.initScroll();
        this.initPics();
      });
    },
    methods: {
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      initPics() {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.list.style.width = width + 'px';
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.wrapper, {
              scrollX: true,
              eventPassthrough: 'vertical',
              click: true
            });
          } else {
            this.picScroll.refresh();
          }
        }
      },
      toggleFavorite($event) {
        if (!$event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  @import '../../common/stylus/base.styl'
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .seller-container
      width: 100%
      .overview
        position: relative
        padding: 18px
        .title
          margin-bottom: 8px
          font-size: 14px
          line-height: 14px
          color: rgb(7, 17, 27)
        .description
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          font-size: 0
          .star
            display: inline-block
            vertical-align: top
            margin-right: 8px
          .text
            display: inline-block
            vertical-align: top
            margin-right: 12px
            line-height: 18px
            font-size: 10px
            color: rgb(77,85,93)
        .remark
          display: flex
          padding-top: 18px
          .block
            flex: 1
            text-align: center
            border-right: 1px solid rgba(7,17,27,0.1)
            &:last-child
              border: none
            h2
              margin-bottom: 4px
              font-size: 10px
              line-height: 10px
              color: rgb(147,153,159)
            .content
              line-height: 24px
              font-size: 10px
              font-weiight: 200
              color: rgb(7,17,27)
              .stress
                font-size: 24px

        .favorite
          position: absolute
          width: 50px
          right: 11px
          top: 18px
          text-align: center
          .icon-favorite
            display: block
            margin-bottom: 4px
            color: #d4d6d9
            line-height: 24px
            font-size: 24px
            &.active
              color: rgb(240,20,20)
          .text
            line-height: 10px
            font-size: 10px
            color: rgb(77,85,93)
      .bulletin
        padding: 18px 18px 0 18px
        .title
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          margin-bottom: 8px
        .content-wrapper
          padding: 0 12px 16px 12px
          border-1px(rgba(7,17,27,0.1))
          .content
            font-size: 12px
            line-height: 24px
            font-weight: 200
            color: rgb(240,20,20)

      .support-wrapper
        margin: 0 18px
        .supports
          .support-item
            padding: 16px 12px
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              border-none()
            .support-icon
              vertical-align: top
              display: inline-block
              width: 16px
              height: 16px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
              &.special
                bg-image('special_4')
            .support-text
              font-size: 12px
              line-height: 16px
              font-weight: 200
              color: rgb(7,17,27)
      .pics
        padding: 18px
        .pic-title
          font-size: 14px
          line-height: 14px
          font-weight: 200
          color: rgb(7,17,27)
          margin-bottom: 12px
        .pic-wrapper
          width: 100%
          overflow: hidden
          white-space: nowrap
          .pic-list
            font-size: 0
            .pic-item
              display: inline-block
              width: 120px
              height: 90px
              margin-right: 6px
              &:last-chlid
                margin: 0


      .seller-info
        margin: 18px
        .info-title
          font-size: 14px
          line-height: 14px
          color: rgb(7,17,27)
          margin-bottom: 12px
        .info-wrapper
          .info-item
            padding: 16px 12px
            font-size: 12px
            line-height: 16px
            color: rgb(7,17,27)
            font-weight: 700
            border-top-1px(rgba(7,17,27,0.1))
</style>
