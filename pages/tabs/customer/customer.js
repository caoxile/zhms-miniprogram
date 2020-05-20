
const db = wx.cloud.database();
let pageNo1 = 0;
let pageNo2 = 0;
let pageNo3 = 0;
const pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    loadmore1: true,
    loadmore2: true,
    loadmore3: true,
    untryCustomers:[],
    unsignCustomers:[],
    signedCustomers:[],
    currentNav: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUntry();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    pageNo1 = 0;
    pageNo2 = 0;
    pageNo3 = 0;
  },
  onShow: function(){
      let current = this.data.currentNav;
      if (current ===0){
          this.getUntry();
      }
      if (current ===1){
          this.getUnSign();
      }
      if (current ===2){
          this.getSigned();
      }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getUntry: function() {
        let that = this;
        db.collection('customer').skip(pageNo1*pageSize).limit(pageSize).where({
            status:'未试骑'
        }).orderBy('add_date', 'desc').get().then( ({data})  => {
          if (pageNo1 == 0) {
          that.setData({
              untryCustomers: data,
              loadmore1: data.length >= pageSize,
              loading1: false
          });
          } else {
          that.setData({
              untryCustomers: that.data.untryCustomers.concat(data),
              loadmore1: data.length >= pageSize,
              loading1: false
          });
          }
      });
    },

    getUnSign: function() {
        let that = this;
        db.collection('customer').skip(pageNo2*pageSize).limit(pageSize).where({
            status:'未签单'
        }).orderBy('try_date', 'desc').get().then( ({data})  => {
            if (pageNo2 == 0) {
            that.setData({
                unsignCustomers: data,
                loadmore2: data.length >= pageSize,
                loading2: false
            });
        } else {
            that.setData({
                unsignCustomers: that.data.unsignCustomers.concat(data),
                loadmore2: data.length >= pageSize,
                loading2: false
            });
        }
    });
    },
    getSigned: function() {
        let that = this;
        db.collection('customer').skip(pageNo3*pageSize).limit(pageSize).where({
            status:'已签单'
        }).orderBy('try_date', 'desc').get().then( ({data})  => {
            if (pageNo3 == 0) {
            that.setData({
                signedCustomers: data,
                loadmore3: data.length >= pageSize,
                loading3: false
            });
        } else {
            that.setData({
                signedCustomers: that.data.signedCustomers.concat(data),
                loadmore3: data.length >= pageSize,
                loading3: false
            });
        }
    });
    },

  /**
   * Swiper页发生变化
   */
  onSwiperChange: function (e) {
    const { current } = e.detail;
    this.setData({
      currentNav: current
    });
      if (current ===0){
          this.getUntry();
      }
      if (current ===1){
          this.getUnSign();
      }
      if (current ===2){
          this.getSigned();
      }
  },
  /**
   * 点击改变Swiper
   */
  changeSwiper: function (e) {
    const { nav } = e.currentTarget.dataset;
    const { currentNav } = this.data;
    if (currentNav != nav) {
      this.setData({
        currentNav: nav
      });
    }
  },
  /**
   * Scroll触底事件
   */
  onScrolTolLower: function (e) {
    const { nav } = e.currentTarget.dataset;
    const that = this;
    if (nav === 'untry' && that.data.loadmore1 && !that.data.loading1) {
      that.setData({ loading1: true });
      pageNo1++;
        that.getUntry();
    } else if (nav === 'unsign' && that.data.loadmore2 && !that.data.loading2) {
      that.setData({ loading2: true });
      pageNo2++;
        that.getUnSign();
    } else if (nav === 'signed' && that.data.loadmore3 && !that.data.loading3) {
      that.setData({ loading3: true });
      pageNo3++;
        that.getSigned();
    }
  },
    //打电话
    bindPhoneCall:function(e){
        wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.id
        });
    },
})