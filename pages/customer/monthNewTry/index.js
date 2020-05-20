import {getFirstAndLastDateOfMonth,getFirstAndLastDateOfYear} from '../../../utils/util.js'

const app = getApp();
const db = wx.cloud.database();
const pageSize = 10;
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: [],
    loading: false,
    pageNo: 0,
    hasMore: true,
    currentMonth:getFirstAndLastDateOfMonth(new Date()),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

    onShow: function(){
      this.searchCustomer();
    },

  /**
   * 搜索
   */
  searchCustomer: function(){
      let that = this;
      const { pageNo, result } = this.data;
      this.setData({
          loading: true
      })
      wx.showLoading({
          title: 'loading...',
      })
      db.collection('customer').skip(pageNo*pageSize).limit(pageSize).where({
          status:_.in(['未签单','已签单']),
          try_date: _.gte(this.data.currentMonth[0]).and(_.lte(this.data.currentMonth[1]))
      }).get().then( ({data})  => {
          that.setData({
          result: pageNo?[...result, ...data]:[...data],
          loading: false,
          pageNo: pageNo+1,
          hasMore: data.length >= pageSize
        })
        wx.hideLoading()
      });
  },

  /**
   * 取消返回
   */
  goBack: function () {
    wx.navigateBack()
  },

  /**
   * 触底加载更多
   */
  loadMore: function (e) {
    const { loading, hasMore } = this.data;
    if (!loading && hasMore) {
      this.searchCustomer()
    }
  },

    //打电话
    bindPhoneCall:function(e){
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.id
        });
    },
})