// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'zhms-crm'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {_id:_id,data:data} = event;
  try{
      return await db.collection('customer').doc(_id).update({
          data:data
          })
      }catch(e){
          console.log(e);
  }
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}