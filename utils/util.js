function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  // var hour = date.getHours()
  // var minute = date.getMinutes()
  // var second = date.getSeconds()


  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getFirstAndLastDateOfWeek(date){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay()+1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstDay = new Date(curr.setDate(first));
    var lastDay = new Date(curr.setDate(last));
    return [formatTime(firstDay),formatTime(lastDay)]
}

function getFirstAndLastDateOfMonth(date){
    var y = date.getFullYear(), m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    return [formatTime(firstDay),formatTime(lastDay)]
}

function getFirstAndLastDateOfYear(date){
    var y = date.getFullYear();
    var firstDay = new Date(y, 0, 1);
    var lastDay = new Date(y, 12, 0);
    return [formatTime(firstDay),formatTime(lastDay)]
}

function getMiddleDatesOfYear(date) {
  var y = date.getFullYear();
  var firstDay = new Date(y, 4, 31);
  var lastDay = new Date(y, 5, 1);
  return [formatTime(firstDay), formatTime(lastDay)]
}


var getPreDate = function (days) {
  var time = Date.now();
  var preTime = time - days * 24 * 60 * 60 * 1000;
  var preDate = new Date(preTime);
  var year = preDate.getFullYear();
  var month = preDate.getMonth() + 1;
  var day = preDate.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

/**
 * Object参数格式化
 * @param {Object} params 参数
 */
export const parseParams = params => {
  let paramArr = [];
  for (const key in params) {
    paramArr.push(`${key}=${params[key]}`);
  }
  return paramArr.join('&');
};

export function isEmpty(object) {
  try {
    for(let item of object) 
      return false;
  } catch (e) {
    return true;
  }
  return true
}

module.exports = {
  getFirstAndLastDateOfWeek:getFirstAndLastDateOfWeek,
  getFirstAndLastDateOfMonth:getFirstAndLastDateOfMonth,
  getFirstAndLastDateOfYear:getFirstAndLastDateOfYear,
  formatTime: formatTime,
  getPreDate: getPreDate,
  getMiddleDatesOfYear: getMiddleDatesOfYear,
  isEmpty
}
