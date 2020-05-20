// discovery
import { getFirstAndLastDateOfMonth, getFirstAndLastDateOfYear, getMiddleDatesOfYear} from '../../../utils/util.js'

var app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  data: {
    monthNewAdd: 0,
    monthNewTry: 0,
    monthMoneyOfSign: 0,
    monthMoneyOfRenew: 0,
    yearMoneyOfSign1:0,
    yearMoneyOfSign2: 0,
    yearMoneyOfRenew:0,
    currentMonth:getFirstAndLastDateOfMonth(new Date()),
    currentYear:getFirstAndLastDateOfYear(new Date()),
    middleDatesOfYear: getMiddleDatesOfYear(new Date()),
    images:['https://caoxile.oss-cn-beijing.aliyuncs.com/xiaochengxu/images/member_price_new.png','https://caoxile.oss-cn-beijing.aliyuncs.com/xiaochengxu/images/rent_price_new.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this
    wx.getSystemInfo({
      success(res) {
        that.setData({
          swiperHeight: res.windowWidth*3/5
        })
      },
    })
    // this.getData();
  },
    onShow:function () {
      this.getData();
    },

  /**
   * 获取数据
   */
  getData() {
     this.getMonthNewAdd();
     this.getMonthNewTry();
     this.getMonthMoneyOfSign();
     this.getMonthMoneyOfRenew();
     this.getYearMoneyOfSign1();
     this.getYearMoneyOfSign2();
     this.getYearMoneyOfRenew();
  },

    /**
     * 本月新增加客户数量
     */
   getMonthNewAdd(){
     db.collection('customer').where({
         add_date: _.gte(this.data.currentMonth[0]).and(_.lte(this.data.currentMonth[1]))
     }).count().then(res => {
         this.setData({
         monthNewAdd : res.total
     })
     })
   },

    /**
     * 本月试骑客户数量
     */
   getMonthNewTry(){
       db.collection('customer').where({
           status:_.in(['未签单','已签单']),
           try_date: _.gte(this.data.currentMonth[0]).and(_.lte(this.data.currentMonth[1]))
       }).count().then(res => {
           this.setData({
           monthNewTry: res.total
       })
   })
   },

    /**
     * 本月新签单金额
     */
    getMonthMoneyOfSign(){
        db.collection('customer').where({
            status:'已签单',
            try_date: _.gte(this.data.currentMonth[0]).and(_.lte(this.data.currentMonth[1]))
        }).get().then(res => {
            let monthMoneyOfSign = 0;
            if(res.data.length>0){
                let subjects = res.data;
                for (let item of subjects) {
                    let card_money = parseInt(item.card_money);
                    monthMoneyOfSign += card_money?card_money:0;
                }
            }
            this.setData({
            monthMoneyOfSign: monthMoneyOfSign
        })
    })
    },

    /**
     * 本月续费金额
     */
    getMonthMoneyOfRenew(){
        db.collection('customer').where({
            status:'已签单',
            renew:{renew_date: _.gte(this.data.currentMonth[0]).and(_.lte(this.data.currentMonth[1]))}
        }).get().then(res => {
            let monthMoneyOfRenew = 0;
        if(res.data.length>0){
            let subjects = res.data;
            for (let item of subjects) {
                for(let renew of item.renew){
                    if(renew.renew_date>=this.data.currentMonth[0] && renew.renew_date<=this.data.currentMonth[1]){
                        let renew_money = parseInt(renew.renew_money);
                        monthMoneyOfRenew += renew_money?renew_money:0;
                    }
                }
            }
        }
        this.setData({
            monthMoneyOfRenew: monthMoneyOfRenew
        })
    })
    },

    /**
     * 本年度新签单金额
     */
    getYearMoneyOfSign1(){
        db.collection('customer').where({
          status:'已签单',
          try_date: _.gte(this.data.currentYear[0]).and(_.lte(this.data.middleDatesOfYear[0]))
        }).get().then(res => {
            let yearMoneyOfSign1 = 0;
        if(res.data.length>0){
            console.log(res.data.length);
            let subjects = res.data;
            for (let item of subjects) {
                console.log(item.try_date)
                let card_money = parseInt(item.card_money);
                yearMoneyOfSign1 += card_money?card_money:0;
            }
        }
        this.setData({
          yearMoneyOfSign1: yearMoneyOfSign1
        })
    })
    },

  getYearMoneyOfSign2() {
    db.collection('customer').where({
      status: '已签单',
      try_date: _.gte(this.data.middleDatesOfYear[1]).and(_.lte(this.data.currentYear[1]))
    }).get().then(res => {
      let yearMoneyOfSign2 = 0;
      if (res.data.length > 0) {
        console.log(res.data.length);
        let subjects = res.data;
        for (let item of subjects) {
          console.log(item.try_date)
          let card_money = parseInt(item.card_money);
          yearMoneyOfSign2 += card_money ? card_money : 0;
        }
      }
      this.setData({
        yearMoneyOfSign2:  yearMoneyOfSign2
      })
    })
  },

    /**
     * 本年度续费金额
     */
    getYearMoneyOfRenew(){
        db.collection('customer').where({
          status:'已签单',
            renew:{renew_date: _.gte(this.data.currentYear[0]).and(_.lte(this.data.currentYear[1]))}
        }).get().then(res => {
        let yearMoneyOfRenew = 0;
        if(res.data.length>0){
            let subjects = res.data;
            for (let item of subjects) {
                for(let renew of item.renew){
                    if(renew.renew_date>=this.data.currentYear[0] && renew.renew_date<=this.data.currentYear[1]){
                        let renew_money = parseInt(renew.renew_money);
                        yearMoneyOfRenew += renew_money?renew_money:0;
                    }
                }
            }
        }
        this.setData({
            yearMoneyOfRenew: yearMoneyOfRenew
        })
    })
    },
    //图片预览
    onImagePre(e) {
        const { img } = e.currentTarget.dataset;
        const { images } = this.data;
        wx.previewImage({
            current: img,
            urls:images
        })
    },
})
