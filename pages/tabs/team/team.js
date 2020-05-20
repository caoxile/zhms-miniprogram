/**
 * 同事
 */

var app = getApp();
const db = wx.cloud.database();

Page({

  data: {
    loading: true,
    colleagues:[],
    userInfo: {}
  },

  //页面加载
  onLoad: function () {
    this.getColleagues();
  },


  //获取团队同事列表
  getColleagues: function() {
      let that = this;
      db.collection('colleague').get(
      ).then(({ data }) => {
          that.setData({
          loading: false,
          colleagues: data,
      });
    });
  },
  //打电话
  bindPhoneCall:function(e){
      wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.id
      });
  },

})
