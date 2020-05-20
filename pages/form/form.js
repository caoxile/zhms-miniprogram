import {formatTime} from '../../utils/util.js'
const db = wx.cloud.database();
Page({

  data: {
      renew_add_show:true,
      customer:null,
      _id:null
  },
  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
      if(options._id){
        this.getCustomer(options._id);
        this.setData({
            _id:options._id
        })
      }
  },

  getCustomer: function(_id){
      let that = this;
      db.collection('customer').where({
          _id:_id
      }).get().then(res => {
          console.log(res.data[0]);
          that.setData({
            customer:res.data[0]
          })
      }).catch(res => {
      });
  },
    onStatusChange(event) {
        const { key } = event.currentTarget.dataset;
        this.setData({ [key]: event.detail });
    },
    bindDateChange(event) {
        const { key } = event.currentTarget.dataset;
        this.setData({ [key]: event.detail.value });
    },
    addRenew(event){
        const { key } = event.currentTarget.dataset;
        let emptyRenew = [{renew_data:'',renew_moeny:'',renew_info:''}];
        this.setData({ renew_add_show:false,[key]: this.data.customer.renew ?this.data.customer.renew.concat(emptyRenew):emptyRenew})
    },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
      var data = e.detail.value;
      if(!data.status){
          wx.showToast({
              title: '签单状态必填',
              duration: 2000
          })
      }else if(!(data.phone || data.weixin)){
          wx.showToast({
              title: '手机或微信必填',
              duration: 2000
          })
      }else{
          delete data['未试骑'];
          delete data['已签单'];
          delete data['未签单'];
          let renew =[];
          for(var i=0;i<3;i++){
              let renew_date = "renew"+i+".renew_date";
              let renew_money = "renew"+i+".renew_money";
              let renew_info = "renew"+i+".renew_info";
              if(data[renew_date]&&data[renew_money]){
                  renew = renew.concat({renew_date:data[renew_date],renew_money:data[renew_money],renew_info:data[renew_info]});
              }
              delete data[renew_date];
              delete data[renew_money];
              delete data[renew_info];
          }
          data.renew = renew;
          console.log(data);
          if(this.data._id){
              // data._openid = this.data.customer._openid;
              // console.log(data._openid);
              wx.cloud.callFucntion({
                  name:'updateCustomer',
                  data:data
              })
              // db.collection('customer').doc(this.data._id).update({
              //     data: data
              // }).then(res => {
              //     console.log(res)
              //     wx.showToast({
              //     title: '成功',
              //     icon: 'success',
              //     duration: 1000
              //     })
              // wx.navigateBack()
              // }).catch(res => {
              //     console.log(res);
              //     wx.showToast({
              //     title: '失败',
              //     icon: 'none',
              //     duration: 1000
              // })
              // });
          }else{
              console.log("add");
              data.add_date = formatTime(new Date());
              db.collection('customer').add({
                  data: data
              }).then(res => {
              wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 1000
                })
              wx.navigateBack()
              }).catch(res => {
                  wx.showToast({
                  title: '失败',
                  icon: 'none',
                  duration: 1000
                })
              });
          }
      }
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
  }
})
