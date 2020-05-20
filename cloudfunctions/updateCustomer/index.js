const cloud = require('wx-server-sdk')
cloud.init({
    env: 'zhms_crm'
})
const db = cloud.database()

exports.main = async(event,content) => {
    const { userInfo: { openId }, data:data } = event;
    console.log(event);
    db.collection('customer').doc(data._id).update({
        data: data
    }).then(res => {
        console.log(res)
    wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1000
    })
    wx.navigateBack()
}).catch(res => {
        console.log(res);
    wx.showToast({
        title: '失败',
        icon: 'none',
        duration: 1000
    })
});
}