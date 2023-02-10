//获取当前日期，格式YYYY-MM-DD
export function getNowFormatDay(nowDate) {
    var char = "-";
    if (nowDate == null) {
      nowDate = new Date();
    }
    var day = nowDate.getDate();
    var month = nowDate.getMonth() + 1; //注意月份需要+1
    var year = nowDate.getFullYear();
    //补全0，并拼接
    return year + char + completeDate(month) + char + completeDate(day);
  }
  
  //获取当前时间，格式YYYY-MM-DD HH:mm:ss
  export function getNowFormatTime() {
    var nowDate = new Date();
    var colon = ":";
    var h = nowDate.getHours();
    var m = nowDate.getMinutes();
    var s = nowDate.getSeconds();
    //补全0，并拼接
    return (
      getNowFormatDay(nowDate) +
      " " +
      completeDate(h) +
      colon +
      completeDate(m) +
      colon +
      completeDate(s)
    );
  }
  
  //计算两个时间之间的时间差 多少天时分秒
  export function intervalTime(startTime, endTime) {
    var date1 = startTime; //开始时间
    var date2 = endTime; //结束时间
    // var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
    var date3 = date2 - date1; //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数
  
    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
  
    //计算相差秒数
  
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    // console.log(days + "天 " + hours + "小时 ")
    return days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒";
    // return   days + "天 " + hours + "小时 "
  }
  
  //补全0
  function completeDate(value) {
    return value < 10 ? "0" + value : value;
  }
  