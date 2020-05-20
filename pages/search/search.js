
const app = getApp();
const db = wx.cloud.database();
const pageSize = 5;
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: "",
    paragraph: '&emsp;人生就是一列开往坟墓的列车，路途上会有很多站，很难有人可以自始至终陪着走完。当陪你的人下车时，即使不舍也该心存感激，然后挥手道别。',
    result: null,
    loading: false,
    pageNo: 0,
    hasMore: true,
    quote:{
        content:'要么全力以赴的干，要么早点滚蛋，在任何一个位置混日子迟早会有人拿你开刀，你要明白，做企业不是做慈善，如果你愿意被慈善，我建议你去要饭。',
        source:'董明珠'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  clearInput: function () {
    this.setData({
      inputVal: "",
      result: null
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  /**
   * 用户确认搜索
   */
  inputConfirm() {
    const that = this;
    const { inputVal } = this.data;
    this.setData({
      scrollTop: 0,
      pageNo: 0,
      hasMore: true
    }, () => {
      that.searchCustomer()
    })
  },

  /**
   * 搜索
   */
  searchCustomer: function(){
      let that = this;
      const { inputVal, pageNo, result } = this.data;
      this.setData({
          loading: true
      })
      wx.showLoading({
          title: 'loading...',
      })
      db.collection('customer').skip(pageNo*pageSize).limit(pageSize).where(
         _.or([
             {phone:db.RegExp({ regexp: inputVal, options: 'i', })},
             {card_no:db.RegExp({ regexp: inputVal, options: 'i', })}
         ])
      ).get().then( ({data})  => {
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